# Transcript: Implementing Infrastructure as Code (IaC) Scanning
**Speaker:** Cameron Hammond  
**Role:** Platform Engineering Intern  
**Company:** SonicWall  
**Date:** Summer Internship (Between Graduate Years)

---

## Introduction: The Platform Engineer as a Service
Hello, my name is **Cameron Hammond**. This experience took place during my internship at **SonicWall** between the first and second years of my graduate program. 

As a Platform Engineer, I was taught early on that our internal teams—Security, Development, QA, and Testing—are our clients. Our job is to build platforms that fulfill their specific needs. One of the major projects I was put in charge of was integrating a security suite from a company called **Wiz**.

---

## The Challenge: Securing Terraform at Scale
Wiz offers a variety of tools to secure a company's technical stack at every stage of the development process (code, pipeline, and infrastructure). SonicWall, a mid-sized cybersecurity company itself, was in the process of adopting these tools.

A critical missing piece was a way to scan all new or changed **Infrastructure as Code (IaC)** files. Since SonicWall uses **Terraform** primarily, security vulnerabilities could easily slip into the code before deployment. I was tasked with finding a way to ensure all Terraform files were securely written and followed industry best practices.

---

## Technical Implementation: The GitLab Pipeline
I evaluated the existing pipeline for pushing and pulling Terraform code within **GitLab**. After researching the documentation for both GitLab and Wiz, I built a custom scanning tool into the GitLab CI/CD pipeline.

### How the Pipeline Functions:
* **Trigger:** Every time a GitLab Merge Request (Pull Request) is initiated, the scanner runs.
* **Evaluation:** It identifies any Terraform files within the request and evaluates them for vulnerabilities.
* **Categorization:** Vulnerabilities are ranked as **Critical, High, Medium, or Low**.
* **Governance:** Based on team feedback, I configured the system so that critical vulnerabilities would force developers to acknowledge them and, in most cases, stop the merge request from completing until addressed.

---

## Business Impact and "The Sell"
A key detail of this project was "selling" the idea to upper management. Adding a new step to a deployment pipeline increases overhead, which is something leadership does not take lightly. 

I was brought into calls to advocate for this process. I had to explain:
1. **The Necessity:** Why we needed to catch these errors before they hit production.
2. **The Benefits:** Increased security posture and reduced manual review time.
3. **Mitigation:** How I optimized the tool to minimize the impact on developer speed.

---

## Results and Visibility
The project was a success and was eventually promoted from my **sandbox** environment through **QA**, **Development**, and finally into the **Production** branches across the entire company.

To ensure maximum visibility, I integrated the results with both the **Wiz Dashboard** and the **GitLab Dashboard**. This allowed both the security team and the developers to have a clear, unified view of the infrastructure's security health. It was a huge honor to champion this project from research to production.

---
**Keywords:** Wiz, SonicWall, Terraform, Infrastructure as Code (IaC), GitLab CI/CD, DevSecOps, Pipeline Security, Cloud Infrastructure, Stakeholder Management.