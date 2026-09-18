import { Component, type ErrorInfo, type ReactNode } from 'react';

import { logger } from '@/utils/logger';

/**
 * Stops one broken component taking the whole site with it.
 *
 * React unmounts the entire tree when a render throws and nothing catches it,
 * so without this a single bad value anywhere renders a blank white page: no
 * message, no navigation, no way back except a manual reload, and no signal to
 * anyone that it happened. That failure mode has already been mistaken for a
 * server outage during testing, which is exactly how it would be read by a
 * parent on a phone.
 *
 * Has to be a class. Error boundaries are the one thing hooks still cannot do
 * -- there is no useErrorBoundary, and componentDidCatch has no functional
 * equivalent.
 *
 * WHAT IT DOES NOT CATCH, so nobody assumes more than it gives:
 *   - errors inside event handlers (those do not break rendering anyway)
 *   - errors in async code that never touches a render
 *   - errors thrown during server-side rendering, which this app does not do
 * It catches the render path, which is the one that blanks the page.
 *
 * Reporting goes through logger.error, which forwards to Microsoft Clarity in
 * production. That is a weak channel -- no stack traces, no alerting, not
 * searchable by message -- but it is what exists, and a weak signal beats the
 * current zero. Replacing it with a real error service is on the guardrails
 * list; this boundary is where that would plug in.
 */

interface Props {
  children: ReactNode;
  /** Identifies which boundary fired, since there is more than one. */
  context?: string;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error(
      `ErrorBoundary:${this.props.context ?? 'app'}`,
      error,
      info.componentStack,
    );
  }

  private reset = () => {
    /* A full reload rather than clearing the error state. Whatever produced
       the bad render is usually still in memory -- a cached query result, a
       corrupted localStorage entry -- so re-rendering the same tree tends to
       throw again immediately and look like the button does nothing. */
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      /* Deliberately plain: this renders when the app is known to be in a bad
         state, so it uses no design-system component, no context, no data
         fetch and no router. Anything it depended on could be the thing that
         just broke. Inline styles for the same reason -- if the stylesheet
         failed to load, Tailwind classes would render an unstyled page. */
      <div
        role="alert"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: '#F9F5F1',
          color: '#1F1B17',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '420px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 10px', lineHeight: 1.25 }}>
            Something went wrong on this page
          </h1>
          <p style={{ fontSize: '15px', lineHeight: 1.6, margin: '0 0 20px', color: '#5A524A' }}>
            Not your fault, and nothing you did is lost. Reloading usually fixes
            it. If it keeps happening, tell us and we will look.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={this.reset}
              style={{
                minHeight: '44px', padding: '0 20px', borderRadius: '999px',
                border: 'none', background: '#FF8000', color: '#fff',
                fontSize: '15px', fontWeight: 700, cursor: 'pointer',
              }}
            >
              Reload the page
            </button>
            {/* A plain anchor, not a router Link: the router may be the thing
                that broke, and a hard navigation always works. */}
            <a
              href="/"
              style={{
                minHeight: '44px', padding: '0 20px', borderRadius: '999px',
                display: 'inline-flex', alignItems: 'center',
                border: '1px solid #D5CBBE', color: '#1F1B17',
                fontSize: '15px', fontWeight: 600, textDecoration: 'none',
              }}
            >
              Go to the home page
            </a>
          </div>
          {import.meta.env.DEV && this.state.message && (
            <pre
              style={{
                marginTop: '20px', padding: '12px', textAlign: 'left',
                background: '#F4EFE8', borderRadius: '10px', fontSize: '12px',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#5A524A',
              }}
            >
              {this.state.message}
            </pre>
          )}
        </div>
      </div>
    );
  }
}
