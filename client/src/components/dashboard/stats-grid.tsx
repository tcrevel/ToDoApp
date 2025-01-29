import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, DollarSign, ArrowUpRight } from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    icon: DollarSign,
    trend: "+20.1%",
  },
  {
    title: "Active Users",
    value: "2,350",
    icon: Users,
    trend: "+10.5%",
  },
  {
    title: "Active Now",
    value: "573",
    icon: Activity,
    trend: "+12.3%",
  },
];

export function StatsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              {stat.trend}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
