import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Twitter, Linkedin } from "lucide-react";
import { motion } from "framer-motion";

export function ConnectedAccounts({ userId }) {
  const [connectedAccounts, setConnectedAccounts] = useState({
    github: false,
    twitter: false,
    linkedin: false,
  });

  useEffect(() => {
    // Fetch connected accounts
    // This is a mock implementation. Replace with actual API call.
    const fetchConnectedAccounts = async () => {
      // Simulated API call
      const response = await fetch(`/api/users/${userId}/connected-accounts`);
      const data = await response.json();
      setConnectedAccounts(data);
    };

    fetchConnectedAccounts();
  }, [userId]);

  const handleConnect = (platform) => {
    // Implement connection logic here
    console.log(`Connecting to ${platform}`);
  };

  const accountItems = [
    { platform: "github", icon: Github, label: "GitHub" },
    { platform: "twitter", icon: Twitter, label: "Twitter" },
    { platform: "linkedin", icon: Linkedin, label: "LinkedIn" },
  ];

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Connected Accounts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {accountItems.map((item, index) => (
          <motion.div
            key={item.platform}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
          >
            <div className="flex items-center space-x-4">
              <item.icon className="w-6 h-6 text-primary" />
              <span>{item.label}</span>
            </div>
            <Button
              variant={connectedAccounts[item.platform] ? "outline" : "default"}
              onClick={() => handleConnect(item.platform)}
            >
              {connectedAccounts[item.platform] ? "Connected" : "Connect"}
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
