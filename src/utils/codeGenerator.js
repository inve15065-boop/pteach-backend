/**
 * Code generator utility - isolated from controller.
 * Uses template-based generation. Can be extended to use OpenAI for real AI generation.
 */

export const generateCodeProject = async (skill, topic) => {
  const skillLower = (skill || "").toLowerCase();
  const safeTopic = (topic || "Project").replace(/[<>]/g, "");

  if (skillLower === "web development") {
    return `
<!DOCTYPE html>
<html>
  <head>
    <title>${safeTopic}</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <h1>${safeTopic} Project</h1>
    <p>This is an auto-generated web project for ${skill}.</p>
  </body>
</html>
`;
  }
  if (skillLower === "react") {
    return `import React from 'react';

function ${safeTopic.replace(/\s/g, "")}() {
  return (
    <div>
      <h1>${safeTopic}</h1>
    </div>
  );
}

export default ${safeTopic.replace(/\s/g, "")};
`;
  }
  return `// Example project for ${skill}: ${safeTopic}\nconsole.log("Hello World!");`;
};
