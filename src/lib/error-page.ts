export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #FAF5EE; color: #340C12; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2.5rem; background: #FFFFFF; border-radius: 1.5rem; border: 1px solid #E2D5C3; box-shadow: 0 10px 25px -5px rgba(74, 18, 26, 0.05); }
      h1 { font-size: 1.5rem; font-weight: 800; margin: 0 0 0.5rem; color: #340C12; }
      p { color: #7D535A; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.625rem 1.25rem; border-radius: 9999px; font: inherit; font-weight: 600; cursor: pointer; text-decoration: none; border: 1px solid transparent; transition: all 0.2s ease; }
      .primary { background: #4A121A; color: #FFFFFF; }
      .primary:hover { background: #340C12; }
      .secondary { background: #EFE6D8; color: #4A121A; border-color: #E2D5C3; }
      .secondary:hover { background: #E2D5C3; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
