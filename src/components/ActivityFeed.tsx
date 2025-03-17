import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

export function ActivityFeed({ userId }) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Fetch user activities
    // This is a mock implementation. Replace with actual API call.
    const fetchActivities = async () => {
      // Simulated API call
      const response = await fetch(`/api/users/${userId}/activities`);
      const data = await response.json();
      setActivities(data);
    };

    fetchActivities();
  }, [userId]);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="mb-4 last:mb-0 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
            >
              <p className="text-sm font-medium">{activity.action}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(activity.timestamp).toLocaleString()}
              </p>
            </motion.div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
