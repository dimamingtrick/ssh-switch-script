#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const inquirer = require('inquirer');
const chalk = require('chalk');

// Constants
const SSH_DIR = path.join(require('os').homedir(), '.ssh');
const CURRENT_PROFILE_FILE = path.join(SSH_DIR, '.current_profile');

// Helper functions
function getCurrentProfile() {
  try {
    if (fs.existsSync(CURRENT_PROFILE_FILE)) {
      return fs.readFileSync(CURRENT_PROFILE_FILE, 'utf8').trim();
    }
  } catch (error) {
    // Ignore errors
  }
  return '';
}

function setCurrentProfile(profileName) {
  try {
    fs.writeFileSync(CURRENT_PROFILE_FILE, profileName, 'utf8');
  } catch (error) {
    console.error(chalk.red('Error saving current profile:', error.message));
  }
}

function getAvailableProfiles() {
  const profiles = [];
  
  try {
    const items = fs.readdirSync(SSH_DIR);
    
    for (const item of items) {
      const itemPath = path.join(SSH_DIR, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        const idRsaPath = path.join(itemPath, 'id_rsa');
        if (fs.existsSync(idRsaPath)) {
          profiles.push(item);
        }
      }
    }
  } catch (error) {
    console.error(chalk.red('Error reading SSH directory:', error.message));
  }
  
  return profiles.sort();
}

async function switchProfile(profileName) {
  const profileDir = path.join(SSH_DIR, profileName);
  const privateKeySource = path.join(profileDir, 'id_rsa');
  const publicKeySource = path.join(profileDir, 'id_rsa.pub');
  const privateKeyDest = path.join(SSH_DIR, 'id_rsa');
  const publicKeyDest = path.join(SSH_DIR, 'id_rsa.pub');
  
  try {
    // Check if profile directory exists
    if (!fs.existsSync(profileDir)) {
      console.error(chalk.red('✗ Profile directory does not exist'));
      return false;
    }
    
    // Check if keys exist in profile
    if (!fs.existsSync(privateKeySource)) {
      console.error(chalk.red('✗ id_rsa file not found in profile directory'));
      return false;
    }
    
    console.log(chalk.blue(`\nSwitching to profile: ${chalk.green(profileName)}`));
    
    // Copy keys
    fs.copyFileSync(privateKeySource, privateKeyDest);
    
    if (fs.existsSync(publicKeySource)) {
      fs.copyFileSync(publicKeySource, publicKeyDest);
    }
    
    // Set proper permissions
    fs.chmodSync(privateKeyDest, 0o600);
    if (fs.existsSync(publicKeyDest)) {
      fs.chmodSync(publicKeyDest, 0o644);
    }
    
    // Update current profile
    setCurrentProfile(profileName);
    
    console.log(chalk.green('✓ Successfully switched to profile:'), chalk.bold(profileName));
    
    // Display public key
    if (fs.existsSync(publicKeyDest)) {
      console.log(chalk.blue('\nYour public key:'));
      console.log(chalk.gray(fs.readFileSync(publicKeyDest, 'utf8')));
    }
    
    return true;
  } catch (error) {
    console.error(chalk.red('✗ Error switching profile:', error.message));
    return false;
  }
}

async function createNewProfile() {
  console.log(chalk.blue('\n╔════════════════════════════════════╗'));
  console.log(chalk.blue('║      Create New Profile            ║'));
  console.log(chalk.blue('╚════════════════════════════════════╝\n'));
  
  const { profileName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'profileName',
      message: 'Enter profile name:',
      validate: (input) => {
        if (!input.trim()) {
          return 'Profile name cannot be empty';
        }
        
        const profileDir = path.join(SSH_DIR, input.trim());
        if (fs.existsSync(profileDir)) {
          return `Profile '${input.trim()}' already exists`;
        }
        
        // Check for invalid characters
        if (!/^[a-zA-Z0-9_-]+$/.test(input.trim())) {
          return 'Profile name can only contain letters, numbers, hyphens, and underscores';
        }
        
        return true;
      }
    }
  ]);
  
  const trimmedName = profileName.trim();
  const profileDir = path.join(SSH_DIR, trimmedName);
  
  try {
    // Create profile directory
    console.log(chalk.blue('\nCreating profile directory...'));
    fs.mkdirSync(profileDir, { recursive: true });
    
    // Generate SSH key
    console.log(chalk.blue('Generating SSH key...\n'));
    
    const keyPath = path.join(profileDir, 'id_rsa');
    const comment = `${trimmedName}@github.com`;
    
    // Run ssh-keygen in interactive mode
    await new Promise((resolve, reject) => {
      const sshKeygen = spawn('ssh-keygen', [
        '-t', 'rsa',
        '-b', '4096',
        '-f', keyPath,
        '-C', comment
      ], {
        stdio: 'inherit'
      });
      
      sshKeygen.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`ssh-keygen exited with code ${code}`));
        }
      });
      
      sshKeygen.on('error', (error) => {
        reject(error);
      });
    });
    
    console.log(chalk.green('\n✓ Profile created successfully!'));
    
    // Ask if user wants to activate this profile
    const { activate } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'activate',
        message: 'Do you want to activate this profile now?',
        default: true
      }
    ]);
    
    if (activate) {
      await switchProfile(trimmedName);
    }
    
    return true;
  } catch (error) {
    console.error(chalk.red('\n✗ Error creating profile:', error.message));
    
    // Cleanup on error
    try {
      if (fs.existsSync(profileDir)) {
        fs.rmSync(profileDir, { recursive: true, force: true });
      }
    } catch (cleanupError) {
      // Ignore cleanup errors
    }
    
    return false;
  }
}

function displayHeader() {
  console.clear();
  console.log(chalk.blue('\n╔════════════════════════════════════╗'));
  console.log(chalk.blue('║     SSH Profile Switcher           ║'));
  console.log(chalk.blue('╚════════════════════════════════════╝\n'));
}

async function main() {
  // Check if SSH directory exists
  if (!fs.existsSync(SSH_DIR)) {
    console.error(chalk.red(`Error: SSH directory not found at ${SSH_DIR}`));
    process.exit(1);
  }
  
  displayHeader();
  
  const profiles = getAvailableProfiles();
  const currentProfile = getCurrentProfile();
  
  // Create choices for menu
  const choices = [];
  
  if (profiles.length === 0) {
    console.log(chalk.yellow('No profiles found.\n'));
  } else {
    profiles.forEach((profile, index) => {
      const isActive = profile === currentProfile;
      const name = isActive 
        ? `${index + 1}. ${profile} ${chalk.green('[+]')}`
        : `${index + 1}. ${profile}`;
      
      choices.push({
        name,
        value: { type: 'switch', profile },
        short: profile
      });
    });
  }
  
  // Add separator and create new profile option
  if (choices.length > 0) {
    choices.push(new inquirer.Separator());
  }
  
  choices.push({
    name: chalk.yellow('Create new profile'),
    value: { type: 'create' },
    short: 'Create new profile'
  });
  
  choices.push(new inquirer.Separator());
  
  choices.push({
    name: chalk.gray('Exit'),
    value: { type: 'exit' },
    short: 'Exit'
  });
  
  // Show menu
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Select an option:',
      choices,
      pageSize: 15
    }
  ]);
  
  // Handle user choice
  switch (action.type) {
    case 'switch':
      await switchProfile(action.profile);
      break;
    case 'create':
      await createNewProfile();
      break;
    case 'exit':
      console.log(chalk.gray('\nGoodbye!\n'));
      break;
  }
}

// Run main function
main().catch((error) => {
  console.error(chalk.red('Error:', error.message));
  process.exit(1);
});

