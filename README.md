# MediConnect Hub - Local Setup Guide

Follow these instructions to get the clinical platform running on your local machine.

## Prerequisites

- **Node.js**: Version 18.x or higher.
- **Package Manager**: npm (comes with Node.js).

## Getting Started

1. **Extract the source code** into a directory of your choice.
2. **Open in VS Code**: Launch VS Code and open the project folder.
3. **Install Dependencies**: Open the integrated terminal and run:
   ```bash
   npm install
   ```
4. **Configure Environment Variables**:
   - Create a `.env.local` file in the root directory.
   - Add your Google AI (Gemini) API key:
     ```text
     GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
     ```
5. **Run the Development Server**:
   ```bash
   npm run dev
   ```
6. **Access the App**:
   - Open your browser to [http://localhost:9002](http://localhost:9002).
   - Use the default credentials on the login page:
     - **Email**: `julian.vane@mediconnect.com`
     - **Password**: `password123`

## Clinical Modules

- **Dashboard**: Overview of tasks and activity.
- **Letter Editor**: AI-assisted consultation letter drafting.
- **Directory**: Verified doctor network and sharing.
- **Audit Log**: HIPAA-compliant activity tracking.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS & ShadCN UI
- **AI**: Genkit with Google Gemini
- **Icons**: Lucide React
