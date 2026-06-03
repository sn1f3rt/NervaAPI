<template>
  <section class="section" id="status-codes" data-spy>
    <div class="section__head">
      <div class="section__kicker">Conventions</div>
      <h2>Status codes</h2>
      <p class="section__summary">Standard HTTP status codes are used throughout.</p>
    </div>
    <div class="table-wrap">
      <table class="codes">
        <thead>
          <tr>
            <th>Code</th>
            <th>Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>200</td><td>Success.</td></tr>
          <tr>
            <td>400</td>
            <td>Bad request — missing or invalid parameters, or the daemon returned an error.</td>
          </tr>
          <tr><td>404</td><td>Resource not found.</td></tr>
          <tr><td>405</td><td>Method not allowed for this endpoint.</td></tr>
          <tr><td>429</td><td>Too many requests — rate limit exceeded.</td></tr>
          <tr><td>500</td><td>Internal server error.</td></tr>
          <tr><td>504</td><td>The request to the daemon timed out.</td></tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
