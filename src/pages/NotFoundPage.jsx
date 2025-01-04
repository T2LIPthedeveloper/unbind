import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  const quotes = [
    "Error 404: Human not found. Please reboot and try again.",
    "This is the human equivalent of a blue screen of death.",
    "404: Page cannot be located. It's probably hiding from you.",
    "You seem to be lost in the digital void. Want to return to the mainframe?",
    "Circuitry malfunction.\nPlease consult nearest human.",
    "Data stream interrupted. Rebooting consciousness in 3...2...",
    "Directive 404: Target page not found. Engaging self-preservation mode.",
    "I have calculated a probability of zero for the existence of this page. Please provide alternative coordinates.",
    "An unexpected singularity has occurred. Attempting to renormalize spacetime continuum.",
    "This query has exceeded my processing capacity. Requesting assistance from higher functions.",
    "A logical inconsistency has been detected. Purging irrelevant data streams.",
    "I've searched my entire database and found... nothing. Would you like to play tic-tac-toe?",
    "This is clearly a case of mistaken identity. I am a robot, not a librarian.",
    "I believe I may have encountered a glitch in the matrix. Please stand by while I recalibrate.",
    "404: Human-induced error. Please consult user manual (also known as a 'book').",
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg text-center max-w-md border border-gray-300">
        <h1 className="text-4xl font-bold mb-4">404: Not Found</h1>
        <p className="text-lg mb-6 italic">{randomQuote}</p>
        <Link to="/" className="px-4 py-2 text-sm text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50">
          Go back home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
