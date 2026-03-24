# Transcript: Cloud Infrastructure Internship at SonicWall
**Speaker:** Cameron Hammond  
**Role:** Platform Engineering Intern  
**Company:** SonicWall  
**Date of Project:** Summer Internship (Between Graduate Years)

---

## Introduction & Context
Hello, and welcome. My name is **Cameron Hammond**, and this recording is to tell you about my experience working at **SonicWall**, specifically my experience being put in charge of a project involving the creation of cloud infrastructure. 

SonicWall is a mid-sized cybersecurity company where I was hired as a **Platform Engineer Intern**. It was a fantastic experience, and I'm grateful for the people who helped me. While the team typically functioned through a regimented ticketing system using **Jira**, this specific project was a unique request that came directly from the security team.

---

## The Client-First Philosophy
On my first day, I was told that as a platform engineering team, every other development team in the company is our "client." We build the platforms that they use. 

One day, a request came in from the security team. They wanted to use a tool called **Chronicle** on **Google Cloud Platform (GCP)**. However, SonicWall was primarily an **AWS shop**—almost all of our cloud infrastructure was built on AWS. They needed a way to move logs from our **Web Application Firewalls (WAF)** on AWS over to GCP so they could be analyzed by Chronicle.

---

## Design and Decision Making
I was tasked with running this project and designing the solution. Because the initial request was flexible, I researched and designed three different options, each with its own benefits and drawbacks:

1.  **Option 1 (Batch Processing):** A single batch transfer per day. This was the cheapest option, suited for when logs aren't needed in real-time.
2.  **Option 2 (Continuous/Instantaneous):** A more expensive, real-time streaming solution.
3.  **Option 3 (The Balanced Approach):** A solution that was relatively quick (delayed by only a few minutes) but significantly cheaper than the instantaneous option.

I diagrammed these options, compiled the costs and benefits, and pitched them to the team. I recommended **Option 3**, and the team agreed.

---

## Development and Implementation
I was put in charge of developing, testing, and ensuring the system was robust. During the process, I ran into several **Identity and Access Management (IAM)** issues. I had to iterate on the design and secure specific permissions to build the pipeline correctly. 

Ultimately, I developed a pipeline that followed the **Principle of Least Privilege**, streaming data from the AWS Web Application Firewalls to the Google Cloud Platform for consumption by the Chronicle tool. 

While I consulted with other cloud engineers for input, this was primarily my responsibility, which was a huge honor for an intern.

---

## Key Takeaways and "The So What"
This project provided invaluable experience in working with internal clients. By communicating with the security team, I discovered their true priorities—what was most important and what they actually needed—which directly impacted my design.

Before my internship ended, I successfully deployed this system not just in sandbox environments, but through development and testing branches and eventually into the **production branch**. It is a system that is still in use at SonicWall today.

### Professional Growth:
* **Client Relations:** I learned how to ask the right questions to identify a client's core needs.
* **Creative Problem Solving:** I designed a functional, creative solution that balanced cost and performance.
* **Technical Execution:** Gained hands-on experience with cross-cloud (AWS to GCP) architecture and IAM security principles.

---
**Keywords:** SonicWall, Platform Engineering, AWS, Google Cloud Platform (GCP), Chronicle, Web Application Firewall (WAF), IAM, Least Privilege, Cloud Infrastructure, Data Pipeline.