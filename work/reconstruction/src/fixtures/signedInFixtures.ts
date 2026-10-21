export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  language: string;
  icon: string;
  updatedAt: string;
  isPrivate: boolean;
  files: Record<string, string>;
  activeFile: string;
  openTabs: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  initials: string;
  avatarColor: string;
  plan: string;
  creditsRemaining: number;
  totalCredits: number;
}

export interface DeploymentItem {
  id: string;
  projectId: string;
  projectName: string;
  url: string;
  status: 'Running' | 'Ready' | 'Stopped';
  environment: string;
  updatedAt: string;
  cpu: string;
  memory: string;
}

export interface IntegrationItem {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  isConnected: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member';
  initials: string;
}

export const initialUserProfile: UserProfile = {
  id: 'usr_alex_01',
  name: 'Alex Builder',
  username: 'alexbuilder',
  email: 'alex@example.com',
  initials: 'AB',
  avatarColor: '#2563EB',
  plan: 'Free',
  creditsRemaining: 85,
  totalCredits: 100
};

export const initialProjects: ProjectItem[] = [
  {
    id: 'proj_demo',
    title: 'DemoProject',
    description: 'Python Flask REST API with microservice architecture',
    language: 'Python',
    icon: '🐍',
    updatedAt: '6 months ago',
    isPrivate: true,
    activeFile: 'main.py',
    openTabs: ['main.py', 'requirements.txt', 'README.md'],
    files: {
      'main.py': `import os
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({
        "status": "healthy",
        "service": "DemoProject API",
        "version": "1.0.0"
    })

@app.route('/api/items', methods=['GET'])
def get_items():
    items = [
        {"id": 1, "name": "App Blueprint", "type": "template"},
        {"id": 2, "name": "Cloud Function", "type": "service"}
    ]
    return jsonify({"items": items, "count": len(items)})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
`,
      'requirements.txt': `flask==3.0.0
gunicorn==21.2.0
requests==2.31.0
pytest==7.4.3
`,
      'README.md': `# DemoProject

A clean Python microservice starter project running on Replit.

## Features
- Flask REST API endpoint routing
- JSON serialization
- Automatic reload in development
`,
      '.replit': `entrypoint = "main.py"
run = "python main.py"

[nix]
channel = "stable-23_11"

[deployment]
run = ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "main:app"]
`
    }
  },
  {
    id: 'proj_commerce',
    title: 'CommerceApp',
    description: 'Modern storefront built with React and Tailwind',
    language: 'TypeScript',
    icon: '⚛️',
    updatedAt: '6 months ago',
    isPrivate: true,
    activeFile: 'src/App.tsx',
    openTabs: ['src/App.tsx', 'package.json'],
    files: {
      'src/App.tsx': `import React from 'react';

export default function CommerceApp() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">CommerceApp Storefront</h1>
      <p className="mt-2 text-gray-600">Browse curated items and place demo orders.</p>
    </div>
  );
}
`,
      'package.json': `{
  "name": "commerce-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
`
    }
  },
  {
    id: 'proj_service',
    title: 'ServiceHub',
    description: 'Customer scheduling and messaging portal',
    language: 'Node.js',
    icon: '🟢',
    updatedAt: '6 months ago',
    isPrivate: true,
    activeFile: 'server.js',
    openTabs: ['server.js'],
    files: {
      'server.js': `const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('ServiceHub running'));
app.listen(3000);
`
    }
  },
  {
    id: 'proj_waitlist',
    title: 'WaitlistApp',
    description: 'Viral referral signup page with analytics',
    language: 'HTML/CSS',
    icon: '🌐',
    updatedAt: '6 months ago',
    isPrivate: true,
    activeFile: 'index.html',
    openTabs: ['index.html'],
    files: {
      'index.html': `<!DOCTYPE html>
<html>
<head><title>WaitlistApp</title></head>
<body><h1>Join the Waitlist</h1></body>
</html>
`
    }
  }
];

export const initialDeployments: DeploymentItem[] = [
  {
    id: 'dep_01',
    projectId: 'proj_demo',
    projectName: 'DemoProject',
    url: 'https://demoproject-alexbuilder.replit.app',
    status: 'Running',
    environment: 'Autoscale',
    updatedAt: '2 days ago',
    cpu: '0.12 vCPU',
    memory: '142 MB / 512 MB'
  },
  {
    id: 'dep_02',
    projectId: 'proj_commerce',
    projectName: 'CommerceApp',
    url: 'https://commerceapp-alexbuilder.replit.app',
    status: 'Ready',
    environment: 'Static',
    updatedAt: '1 week ago',
    cpu: '0.04 vCPU',
    memory: '64 MB / 256 MB'
  }
];

export const initialIntegrations: IntegrationItem[] = [
  {
    id: 'int_github',
    name: 'GitHub',
    category: 'Source Control',
    description: 'Connect repositories, sync branches, and open pull requests.',
    icon: '🐙',
    isConnected: true
  },
  {
    id: 'int_supabase',
    name: 'Supabase',
    category: 'Databases',
    description: 'Postgres database with built-in authentication and real-time subscriptions.',
    icon: '⚡',
    isConnected: false
  },
  {
    id: 'int_neon',
    name: 'Neon Postgres',
    category: 'Databases',
    description: 'Serverless Postgres database with instant branching.',
    icon: '🐘',
    isConnected: false
  },
  {
    id: 'int_figma',
    name: 'Figma',
    category: 'Design',
    description: 'Import design frames directly into component code.',
    icon: '🎨',
    isConnected: false
  },
  {
    id: 'int_slack',
    name: 'Slack',
    category: 'Notifications',
    description: 'Send deployment alerts and agent notifications to your channels.',
    icon: '💬',
    isConnected: true
  },
  {
    id: 'int_sentry',
    name: 'Sentry',
    category: 'Monitoring',
    description: 'Real-time crash reporting and performance observability.',
    icon: '🛡️',
    isConnected: false
  }
];

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'tm_01',
    name: 'Alex Builder',
    email: 'alex@example.com',
    role: 'Owner',
    initials: 'AB'
  },
  {
    id: 'tm_02',
    name: 'Jordan Lee',
    email: 'jordan@example.com',
    role: 'Admin',
    initials: 'JL'
  },
  {
    id: 'tm_03',
    name: 'Taylor Morgan',
    email: 'taylor@example.com',
    role: 'Member',
    initials: 'TM'
  }
];

export const cannedAgentReplies: Record<string, string> = {
  landing: "I've created a responsive landing page with a hero prompt section, features grid, and footer CTA using standard Tailwind classes.",
  error: "I found and fixed the import error on line 4. The server now boots cleanly without exceptions.",
  api: "I added two new REST endpoints `/api/items` and `/api/status` with JSON schemas and status code validation.",
  database: "I configured the database client connection with automatic connection pooling and local fixture fallbacks.",
  default: "I've analyzed the request, updated the file in the workspace, and verified that the development server starts without warnings."
};
