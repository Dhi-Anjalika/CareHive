// src/components/TrendsChart.jsx
import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function TrendsChart({ data = [] }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>Medication Compliance</Typography>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis domain={[0,1]} tickFormatter={(v)=>`${Math.round(v*100)}%`} />
            <Tooltip formatter={(v) => `${Math.round(v*100)}%`} />
            <Line type="monotone" dataKey="compliance" stroke="#00897B" strokeWidth={3} dot />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
