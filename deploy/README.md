# Deployment steps

This project uses Ansible and Docker for deploying the application.

## Ansible Playbooks

Deploying the frontend

```bash
ansible-playbook deploy/deploy_frontend.yml --key-file=~/.ssh/aws-vps1.pem
```

Deploying the backend

```bash
ansible-playbook deploy/deploy_backend.yml --key-file=~/.ssh/aws-vps1.pem
```

Restarting the frontend

```bash
ansible-playbook deploy/create_frontend.yml --key-file=~/.ssh/aws-vps1.pem
```

Restarting the backend

```bash
ansible-playbook deploy/create_backend.yml --key-file=~/.ssh/aws-vps1.pem
```
