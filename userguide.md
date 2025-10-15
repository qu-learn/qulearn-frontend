# QuLearn Platform User Guide

Welcome to QuLearn - a comprehensive online learning platform designed for students, educators, and administrators. This guide will help you navigate and make the most of all the features available.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Installation](#installation)
3. [User Roles](#user-roles)
4. [Student Features](#student-features)
5. [Educator Features](#educator-features)
6. [Administrator Features](#administrator-features)
7. [Course Management](#course-management)
8. [Assessment & Grading](#assessment--grading)
9. [Interactive Tools](#interactive-tools)
10. [Profile Management](#profile-management)
11. [Troubleshooting](#troubleshooting)

## Getting Started

### Installation

To run the QuLearn platform locally:

1. **Install Node.js** (version 16 or higher)
2. **Install pnpm** (recommended package manager):
   ```bash
   npm install -g pnpm
   ```
3. **Clone the repository**:
   ```bash
   git clone https://github.com/qu-learn/qulearn-frontend.git
   cd qulearn-frontend
   ```
4. **Install dependencies**:
   ```bash
   pnpm install
   ```
5. **Start the development server**:
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:5173`

### System Requirements

- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)
- **Internet Connection**: Required for all features
- **Screen Resolution**: Minimum 1024x768, optimized for 1920x1080

## User Roles

QuLearn supports four main user roles:

### 1. **Student**
- Access courses and learning materials
- Take quizzes and assessments
- Track progress and achievements
- Use interactive simulators

### 2. **Educator**
- Create and manage courses
- Monitor student progress
- Access analytics and reports
- Use teaching tools

### 3. **Course Administrator**
- Oversee course quality and content
- Manage course approvals
- Review educator performance

### 4. **System Administrator**
- Manage platform-wide settings
- User management and permissions
- System monitoring and maintenance

## Student Features

### Dashboard
The student dashboard provides an overview of your learning journey:

- **Progress Statistics**: View completion percentages and achievements
- **Course Overview**: Quick access to enrolled courses
- **Recent Activity**: Track your latest learning sessions
- **Upcoming Deadlines**: Stay on top of assignment due dates

### Course Navigation

#### Course Dashboard
Each course has a dedicated dashboard with:

- **Road to Certificate**: Visual progress tracker showing completed and upcoming lessons
- **Learning Activity Calendar**: GitHub-style activity grid showing your learning patterns
- **Course Content**: Organized modules and lessons
- **Assessments**: Available quizzes and their status
- **Grades**: Comprehensive grade tracking with detailed breakdowns

#### Lesson Details
- **Materials**: Access to PDFs, videos, and reference materials
- **Navigation**: Previous/Next lesson buttons with smart module crossing
- **Progress Tracking**: Automatic completion status updates

### Assessment System

#### Taking Quizzes
- **Multiple Attempts**: Up to 3 attempts per quiz (configurable)
- **Real-time Feedback**: Immediate results and explanations
- **Grade Calculation**: Automatic scoring with letter grades (A-F scale)
- **Progress Integration**: Quiz results contribute to overall course progress

#### Grade Tracking
The grades section provides:
- **Assessment Overview**: All quizzes and their status
- **Detailed Scoring**: Points earned, percentage, and letter grade
- **Attempt History**: Track multiple attempts and improvement
- **Grading Scale**: Clear understanding of grade boundaries

### Interactive Learning Tools

#### Circuit Simulator
- **Component Library**: Resistors, capacitors, inductors, and more
- **Visual Design**: Drag-and-drop circuit building
- **Real-time Simulation**: Live voltage and current measurements
- **Save/Load**: Store and share circuit designs

#### Network Simulator
- **Network Topology**: Design complex network architectures
- **Protocol Simulation**: Test different networking protocols
- **Performance Analysis**: Monitor network traffic and performance
- **Scenario Building**: Create custom network scenarios

### Course Discovery
- **Course Catalog**: Browse available courses by category
- **Recommendations**: AI-powered course suggestions based on your interests
- **Enrollment**: One-click course enrollment process
- **Prerequisites**: Clear prerequisite information and tracking

## Educator Features

### Course Creation
Educators can create comprehensive courses with:

#### Course Structure
- **Modules**: Organize content into logical sections
- **Lessons**: Individual learning units with various content types
- **Sequential Learning**: Define prerequisite relationships
- **Flexible Pacing**: Self-paced or instructor-led options

#### Content Management
- **Rich Media Support**: Upload videos, PDFs, images, and interactive content
- **External Links**: Link to external resources and references
- **Material Organization**: Categorize materials by type and importance
- **Version Control**: Track and manage content updates

#### Assessment Creation
- **Quiz Builder**: Create multiple-choice and other question types
- **Flexible Scoring**: Customize point values and grading criteria
- **Attempt Limits**: Set maximum attempts per student
- **Time Limits**: Optional timed assessments

### Student Management

#### Progress Monitoring
- **Class Overview**: View all students' progress at a glance
- **Individual Tracking**: Detailed progress reports for each student
- **Engagement Metrics**: Monitor student activity and participation
- **Intervention Alerts**: Identify students who may need additional support

#### Analytics Dashboard
- **Course Performance**: Overall course statistics and trends
- **Content Effectiveness**: Identify which materials work best
- **Assessment Analysis**: Quiz performance and difficulty analysis
- **Student Insights**: Detailed learning patterns and behaviors

### Communication Tools
- **Announcements**: Broadcast important information to all students
- **Direct Messaging**: One-on-one communication with students
- **Discussion Forums**: Facilitate peer-to-peer learning
- **Feedback System**: Provide personalized feedback on assignments

## Administrator Features

### Course Administration
- **Course Approval**: Review and approve educator-created courses
- **Quality Assurance**: Ensure content meets platform standards
- **Category Management**: Organize courses into logical categories
- **Featured Courses**: Highlight exceptional courses

### User Management
- **User Accounts**: Create, modify, and deactivate user accounts
- **Role Assignment**: Assign and modify user roles and permissions
- **Bulk Operations**: Manage multiple users simultaneously
- **Access Control**: Fine-grained permission management

### System Administration
- **Platform Configuration**: Global settings and preferences
- **Performance Monitoring**: System health and usage analytics
- **Backup Management**: Data backup and recovery procedures
- **Security Settings**: Authentication and security configurations

## Course Management

### Course Structure Best Practices

#### Module Organization
- **Logical Grouping**: Group related concepts together
- **Progressive Difficulty**: Start simple and build complexity
- **Clear Objectives**: Define learning outcomes for each module
- **Reasonable Length**: Keep modules digestible (3-7 lessons each)

#### Lesson Design
- **Single Concept Focus**: One main idea per lesson
- **Multi-modal Content**: Combine text, video, and interactive elements
- **Practical Application**: Include hands-on exercises when possible
- **Assessment Integration**: Regular knowledge checks

### Content Guidelines

#### Material Preparation
- **High-Quality Media**: Use clear, professional audio and video
- **Accessible Content**: Ensure materials work for all learners
- **Mobile-Friendly**: Optimize for various screen sizes
- **Fast Loading**: Compress files for quick access

#### Reference Materials
- **Authoritative Sources**: Link to reputable external resources
- **Relevant Content**: Ensure external links support learning objectives
- **Regular Updates**: Check and update links periodically
- **Backup Options**: Provide alternative resources when possible

## Assessment & Grading

### Quiz Creation Guidelines

#### Question Design
- **Clear Language**: Use simple, unambiguous wording
- **Single Correct Answer**: Ensure only one best answer exists
- **Appropriate Difficulty**: Match question difficulty to learning level
- **Real-world Application**: Connect questions to practical scenarios

#### Feedback Strategies
- **Immediate Response**: Provide instant feedback when possible
- **Explanatory Content**: Explain why answers are correct or incorrect
- **Learning Reinforcement**: Use feedback as a teaching opportunity
- **Positive Encouragement**: Maintain supportive tone in all feedback

### Grading System

The platform uses a standard A-F grading scale:
- **A**: 90-100% (Excellent)
- **B**: 80-89% (Good)
- **C**: 70-79% (Satisfactory)
- **D**: 60-69% (Needs Improvement)
- **F**: 0-59% (Unsatisfactory)

#### Grade Calculation
- **Weighted Assessments**: Different assessments can have different weights
- **Multiple Attempts**: Highest score counts (configurable)
- **Extra Credit**: Optional bonus points for additional activities
- **Curve Adjustments**: Instructors can adjust grades as needed

## Interactive Tools

### Circuit Simulator

#### Getting Started
1. **Access**: Navigate to Simulators → Circuit Simulator
2. **Component Selection**: Choose from the component library
3. **Circuit Building**: Drag and drop components onto the workspace
4. **Connections**: Click and drag to create wires between components
5. **Simulation**: Click "Run" to start the simulation

#### Advanced Features
- **Measurement Tools**: Use multimeters to measure voltage and current
- **Oscilloscope**: Visualize waveforms and signals
- **Component Properties**: Modify component values and characteristics
- **Save/Export**: Save circuits and export as images or data

### Network Simulator

#### Basic Operations
1. **Network Design**: Create network topologies using drag-and-drop
2. **Device Configuration**: Set up routers, switches, and end devices
3. **Protocol Setup**: Configure routing protocols and network settings
4. **Traffic Generation**: Create network traffic for testing
5. **Analysis**: Monitor performance and troubleshoot issues

#### Use Cases
- **Network Planning**: Design and test network architectures
- **Protocol Learning**: Understand how different protocols work
- **Troubleshooting**: Practice identifying and fixing network issues
- **Performance Testing**: Analyze network capacity and bottlenecks

## Profile Management

### Personal Information
Keep your profile updated with:
- **Contact Details**: Email, phone, and location information
- **Professional Info**: Bio and certification preferences
- **Avatar**: Upload a profile picture
- **Privacy Settings**: Control what information is visible to others

### Account Security
- **Password Management**: Regular password updates with strong requirements
- **Two-Factor Authentication**: Optional additional security layer
- **Login History**: Monitor account access and suspicious activity
- **Privacy Controls**: Manage data sharing and communication preferences

### Learning Preferences
- **Notification Settings**: Control email and in-app notifications
- **Display Preferences**: Customize interface colors and layout
- **Accessibility Options**: Text size, contrast, and screen reader support
- **Language Settings**: Multi-language support for international users

## Troubleshooting

### Common Issues

#### Login Problems
- **Forgot Password**: Use the password reset link on the login page
- **Account Locked**: Contact administrator after multiple failed attempts
- **Email Verification**: Check spam folder for verification emails
- **Browser Issues**: Clear cache and cookies, try different browser

#### Course Access Issues
- **Enrollment Required**: Ensure you're enrolled in the course
- **Prerequisites**: Complete required prerequisite courses
- **Payment Issues**: Verify payment status for paid courses
- **Technical Problems**: Report to technical support

#### Video/Media Problems
- **Slow Loading**: Check internet connection speed
- **Playback Issues**: Update browser or try different device
- **Audio Problems**: Check device volume and audio settings
- **Compatibility**: Ensure browser supports required media formats

#### Quiz/Assessment Issues
- **Submission Problems**: Check internet connection before submitting
- **Time Limits**: Be aware of quiz time restrictions
- **Technical Glitches**: Contact instructor if technical issues prevent completion
- **Score Disputes**: Use the appropriate channel to contest grades

### Getting Help

#### Support Channels
- **Help Desk**: Submit tickets for technical issues
- **Live Chat**: Real-time support during business hours
- **Email Support**: Detailed assistance for complex problems
- **Community Forums**: Peer-to-peer help and discussion

#### Documentation
- **User Guides**: Comprehensive guides for all features
- **Video Tutorials**: Step-by-step video instructions
- **FAQ Section**: Answers to frequently asked questions
- **Release Notes**: Information about new features and updates

### Best Practices

#### For Students
- **Regular Participation**: Log in frequently to stay engaged
- **Progress Tracking**: Monitor your advancement regularly
- **Active Learning**: Participate in discussions and interactive elements
- **Time Management**: Set aside dedicated study time
- **Help Seeking**: Don't hesitate to ask for help when needed

#### For Educators
- **Content Quality**: Regularly review and update course materials
- **Student Engagement**: Monitor student progress and provide feedback
- **Communication**: Maintain open channels with students
- **Professional Development**: Stay updated with platform features
- **Analytics Usage**: Use data to improve course effectiveness

#### For Administrators
- **Regular Monitoring**: Keep track of platform performance and usage
- **User Support**: Respond promptly to user issues and requests
- **Security Maintenance**: Regularly update security settings and protocols
- **Backup Procedures**: Maintain regular data backups
- **Training Programs**: Provide ongoing training for users



