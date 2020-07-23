#!/usr/bin/env node
const fs = require("fs");
const readline = require("readline");
const { exec } = require("child_process");

process.stdout.write("\033c"); // clears console

const userName = "dimasrago";
const sshDir = "/Users/dmitryshraho/.ssh";

fs.readdir(`/Users/${userName}/.ssh`, (err, projectsList) => {
  if (err) return console.log("Unable to scan directory: " + err);

  const projects = projectsList.filter(
    i =>
      i !== "authorized_keys" &&
      i !== "id_rsa" &&
      i !== "id_rsa.pub" &&
      i !== "known_hosts"
  );

  for (let i = 0; i < projects.length; i++) {
    process.stdout.write(`${i === 0 ? "\n" : ""}${i} - ${projects[i]} \n`); // display list of all projects with their indexes in console
  }
  // process.stdout.write(`a - generate new ssh\n`);

  switchProject(projects);
});

function switchProject(projects) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("Enter project number you want to switch on: ", async str => {
    rl.close();
    const answer = Number(str);
    let selectedProject = "";

    if (Number.isNaN(answer)) {
      selectedProject = projects.find(i => i === str) || "";
    } else {
      selectedProject = projects[answer];
    }

    if (!selectedProject) {
      console.log("ENTER VALID INDEX BITCHARA");
      return switchProject(projects);
    }

    const command = `
      cd ${sshDir} &&
      cd ./${selectedProject} &&
      cp ./id_rsa ../id_rsa &&
      cp ./id_rsa.pub ../id_rsa.pub
    `;

    exec(command, (err, stdout, stderr) => {
      if (err) console.log("err", err);
      if (stderr) console.log("stderr", stderr);
      if (stdout) console.log("stdout", stdout);

      if (!err && !stderr) {
        console.log(`${selectedProject} is selected :)`);
      }
    });
  });
}
