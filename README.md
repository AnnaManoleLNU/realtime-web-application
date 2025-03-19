# Realtime Web Application

## Overview  
Develop a Node.js web application using Express that integrates real-time technologies like WebSockets and webhooks. The app will list issues from a GitLab repository, update in real-time, and support issue management.

## Features  
### **1. GitLab Integration**  
- Use the GitLab API to list issues from a repository in the "Assignment B2" group.  
- Display issues as HTML rendered from the server.  

### **2. WebSocket Connection**  
- Establish a WebSocket connection between the client and server.  
- Receive new issue events from a GitLab webhook and transmit them in real-time over the WebSocket channel.  

### **3. Issue Management**  
- Allow users to close issues directly from the client.  
- Implement an additional issue-related feature.  

### **4. Code Quality and Standards**  
- Follow the course's coding standards.  
- Split source code into modules.  
- Add `start` and `lint` scripts to `package.json`.  
- Document and comment on the code.  
- Handle HTTP 404 and 500 status codes appropriately.  
- Secure the application against vulnerabilities.  
- Store API keys and webhook tokens in environment variables.  

### **5. Deployment**  
- Deploy the application on the CSCloud server.
