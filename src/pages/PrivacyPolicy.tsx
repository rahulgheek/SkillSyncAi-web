import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto backdrop-blur-sm border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            SkillSync AI
          </span>
        </div>
        <Link to="/">
          <Button variant="ghost" className="font-semibold text-foreground/80 hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <ShieldCheck className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Effective Date: {new Date().toLocaleDateString()}</p>
        </div>

        <Card className="border-border shadow-sm">
          <CardContent className="p-8 prose prose-slate dark:prose-invert max-w-none">
            <p>
              Welcome to SkillSync AI. We are committed to protecting your personal information and your right to privacy.
              This Privacy Policy applies to all information collected through our application, website, and related services.
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              We collect personal information that you voluntarily provide to us when you register on the application,
              including but not limited to your name, email address, university affiliation, and profile information (such as your resume, skills, and projects).
            </p>
            <p>
              When you use Google OAuth to sign in, we collect your Google email address and basic profile information to authenticate your account.
            </p>

            <h2>2. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide, operate, and maintain our application.</li>
              <li>Improve, personalize, and expand our application features.</li>
              <li>Analyze how you use our application.</li>
              <li>Develop new AI-powered teambuilding algorithms and matchmaking services.</li>
              <li>Communicate with you, including sending you verification emails and updates.</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>
              We do not share your personal information with third parties except as necessary to provide our services. 
              Information that you choose to make public, such as your profile, skills, previous projects, and portfolio links, may be visible to other authenticated users of the platform for matchmaking purposes, or to comply with the law.
            </p>

            <h2>4. Third-Party Services (Google and Gemini AI)</h2>
            <p>
              Our application uses Google OAuth in accordance with Google's OAuth implementation guidelines and requests only the permissions necessary for authentication.
            </p>
            <p>
              We also use Google Gemini AI to analyze your uploaded resume and generate career insights. Resume content is processed through the Gemini API solely to generate insights for the user. Uploaded resumes are stored securely and are used only for profile generation, AI-based skill extraction, and career guidance features.
            </p>
            <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 rounded-r-lg mt-4">
              <p className="text-yellow-700 dark:text-yellow-200 text-sm m-0">
                <strong>AI Disclaimer:</strong> AI-generated recommendations, skill analyses, and career roadmaps are intended to assist users and should not be considered professional or career advice.
              </p>
            </div>

            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process.
              However, despite our safeguards, no internet transmission is 100% secure.
            </p>

            <h2>6. Data Retention</h2>
            <p>
              We retain user information only for as long as necessary to provide our services. Users may request deletion of their account and associated data at any time.
            </p>

            <h2>7. Account Deletion</h2>
            <p>
              Users may request deletion of their account, after which their personal information and uploaded files will be removed from the platform, except where retention is required for technical or legal reasons.
            </p>

            <h2>8. Contact Us</h2>
            <p>
              Please note that anyone can sign in on this site using any email address for demonstration and testing purposes.
            </p>
            <p>
              If you have questions or comments about this policy, please contact us at <a href="mailto:demotesting2200@gmail.com" className="text-primary hover:underline">demotesting2200@gmail.com</a>
            </p>
          </CardContent>
        </Card>
      </main>

      <footer className="relative z-10 border-t border-border/40 bg-background/50 py-8 mt-12 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} SkillSync AI. All rights reserved.
      </footer>
    </div>
  );
}
