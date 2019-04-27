import findUp from 'find-up';
import Git from 'nodegit';
import { exec } from './lib/child_process';

export async function startAutomaticUpdate({ interval = 10000 } = {}) {
  const gitPath = await findUp('.git');

  if (gitPath == null) {
    throw new Error('No valid path to .git could be found...');
  }

  setInterval(() => pull(gitPath), interval);
}

// const credentials = (url: any, userName: any) =>
//  Git.Cred.sshKeyFromAgent(userName);

async function pull(gitPath: string) {
  const repository = await Git.Repository.open(gitPath);

  await repository.fetchAll({
    // callbacks: {
    //  credentials,
    // },
  });

  await exec('git stash');
  await repository.mergeBranches('master', 'origin/master');
  await exec('yarn');
}
