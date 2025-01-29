import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CalculationResult {
  number1: number;
  number2: number;
  sum: number;
  randomNumber: number;
  timestamp: string;
}

export default function Calculator() {
  const [number1, setNumber1] = useState<number>(0);
  const [number2, setNumber2] = useState<number>(0);
  const [isEnabled, setIsEnabled] = useState(false);

  const { data, isLoading, error } = useQuery<CalculationResult>({
    queryKey: ['calculator', number1, number2],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:5003/api/calculator/add/${number1}/${number2}`);
      return response.data;
    },
    enabled: isEnabled
  });

  const handleCalculate = () => {
    setIsEnabled(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Calculator Service</h1>
      <Card className="p-6">
        <div className="flex gap-4 mb-4">
          <Input
            type="number"
            value={number1}
            onChange={(e) => setNumber1(Number(e.target.value))}
            placeholder="First number"
          />
          <Input
            type="number"
            value={number2}
            onChange={(e) => setNumber2(Number(e.target.value))}
            placeholder="Second number"
          />
          <Button onClick={handleCalculate}>Calculate</Button>
        </div>

        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: Failed to calculate</p>}
        {data && (
          <div className="space-y-2">
            <p>Sum: {data.sum}</p>
            <p>Random Number: {data.randomNumber}</p>
            <p>Timestamp: {new Date(data.timestamp).toLocaleString()}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
