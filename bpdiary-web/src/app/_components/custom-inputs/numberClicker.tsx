"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import React from "react";
import { Button } from "~/app/_components/shadcn/button";
import { Input } from "~/app/_components/shadcn/input";

export default function NumberClicker() {
  const [value, setValue] = React.useState(0);
  return (
    <div className="flex max-w-sm items-center space-x-2">
      <Input placeholder="0" className="w-14 text-right" value={value} />
      <Button onClick={() => setValue(value + 1)}>
        <ArrowUp />
      </Button>
      <Button onClick={() => setValue(value - 1)}>
        <ArrowDown />
      </Button>
    </div>
  );
}
