import child_process from 'child_process';
import findUp from 'find-up';
import Git from 'nodegit';

export async function startAutomaticUpdate({ interval = 10000 } = {}) {
  const gitPath = await findUp('.git');

  if (gitPath == null) {
    throw new Error('[git-auto-update] => No valid git path could be found...');
  }

  setInterval(() => pull(gitPath), interval);
}

const credentials = (url: any, userName: any) =>
  Git.Cred.sshKeyFromAgent(userName);

async function pull(gitPath: string) {
  const repository = await Git.Repository.open(gitPath);

  await repository.fetchAll({
    callbacks: {
      credentials,
    },
  });

  await exec('git stash');
  await repository.mergeBranches('master', 'origin/master');
  child_process.exec('npm install --package-lock=false');
}
