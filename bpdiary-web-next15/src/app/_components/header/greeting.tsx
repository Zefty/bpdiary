"use client";

export default function Greeting() {
  const hours = new Date().getHours();
  if (hours >= 0 && hours < 6) return "Good night";
  if (hours >= 6 && hours < 12) return "Good morning";
  if (hours >= 12 && hours < 18) return "Good afternoon";
  if (hours >= 18 && hours < 24) return "Good night";
  return "";
}
