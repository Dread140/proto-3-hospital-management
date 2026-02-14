import { Card, CardContent, Typography } from '@mui/material';

export default function MetricCard({ title, value }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h4">{value ?? '-'}</Typography>
      </CardContent>
    </Card>
  );
}
