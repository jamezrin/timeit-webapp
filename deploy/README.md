# Deployment steps

This project uses Ansible and Docker for deploying the application.

## Help

- https://www.serverlab.ca/tutorials/dev-ops/automation/how-to-use-ansible-to-deploy-your-website/
- https://www.ansible.com/blog/how-i-switched-from-docker-compose-to-pure-ansible
- https://medium.com/@sairamkrish/simple-ansible-script-to-deploy-nodejs-microservices-37240ad59f1a
- https://gist.github.com/kbariotis/58d6ed6d634a8f2ae2bfa4a558d3113c
- https://codelike.pro/deploy-nodejs-app-with-ansible-git-pm2/


## Running playbooks

```
ansible-playbook -vvvv --private-key=~/.ssh/aws-vps1 playbookname.yml
```
