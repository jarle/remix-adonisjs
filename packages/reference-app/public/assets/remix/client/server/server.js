import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, json } from "@remix-run/node";
import { RemixServer, Meta, Links, Outlet, ScrollRestoration, Scripts, useRouteError, isRouteErrorResponse, useLoaderData, useActionData, Form, Await, defer } from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { cssBundleHref } from "@remix-run/css-bundle";
import { Suspense } from "react";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isBotRequest(request.headers.get("user-agent")) ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function isBotRequest(userAgent) {
  if (!userAgent) {
    return false;
  }
  if ("isbot" in isbotModule && typeof isbotModule.isbot === "function") {
    return isbotModule.isbot(userAgent);
  }
  if ("default" in isbotModule && typeof isbotModule.default === "function") {
    return isbotModule.default(userAgent);
  }
  return false;
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [
  ...cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []
];
function App() {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(
        "link",
        {
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css"
        }
      ),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx("main", { children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx(Outlet, {}) }) }),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App,
  links
}, Symbol.toStringTag, { value: "Module" }));
function ErrorBoundaryComponent() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("h1", { children: [
        error.status,
        " ",
        error.statusText
      ] }),
      /* @__PURE__ */ jsx("p", { children: error.data })
    ] });
  } else if (error instanceof Error) {
    return /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { children: "Error" }),
      /* @__PURE__ */ jsx("p", { children: error.message }),
      /* @__PURE__ */ jsx("p", { children: "The stack trace is:" }),
      /* @__PURE__ */ jsx("pre", { children: error.stack })
    ] });
  } else {
    return /* @__PURE__ */ jsx("h1", { children: "Unknown Error" });
  }
}
const loader$5 = () => {
  throw new Response("This is a test thrown response", { status: 400 });
};
const ErrorBoundary$1 = () => /* @__PURE__ */ jsx(ErrorBoundaryComponent, {});
function page$1() {
  return null;
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$1,
  default: page$1,
  loader: loader$5
}, Symbol.toStringTag, { value: "Module" }));
const loader$4 = async ({ context }) => {
  const app = await context.make("app");
  return json({
    env: app.getEnvironment()
  });
};
function Page$4() {
  const { env } = useLoaderData();
  return /* @__PURE__ */ jsx("p", { children: env });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Page$4,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
const action$1 = async ({ request, context }) => {
  const body = await request.text();
  const { http } = context;
  http.logger.info("webhook body", body);
  return json({
    status: "ok"
  });
};
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1
}, Symbol.toStringTag, { value: "Module" }));
const loader$3 = () => {
  throw new Error("This is a test error");
};
const ErrorBoundary = () => /* @__PURE__ */ jsx(ErrorBoundaryComponent, {});
function page() {
  return null;
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  default: page,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
const action = () => {
  return json({
    message: "Thank you for your feedback!"
  });
};
function Page$3() {
  const actionData = useActionData();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("h1", { children: "Feedback" }),
    /* @__PURE__ */ jsxs(Form, { method: "post", children: [
      /* @__PURE__ */ jsxs("label", { children: [
        "Name",
        /* @__PURE__ */ jsx("input", { type: "text", name: "name", id: "name", required: true })
      ] }),
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsxs("label", { children: [
        "Email",
        /* @__PURE__ */ jsx("input", { type: "email", name: "email", id: "email", required: true })
      ] }),
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsxs("label", { children: [
        "Message",
        /* @__PURE__ */ jsx("textarea", { name: "message", id: "message" })
      ] }),
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("button", { type: "submit", children: "Submit" })
    ] }),
    actionData ? /* @__PURE__ */ jsx("p", { className: "alert", children: actionData.message }) : null
  ] });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: Page$3
}, Symbol.toStringTag, { value: "Module" }));
const loader$2 = () => {
  return json({
    userName: "John Doe",
    email: "john.doe@example.com"
  });
};
function Page$2() {
  const { userName, email } = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h1", { children: "Profile" }),
    /* @__PURE__ */ jsx("p", { id: "name", children: userName }),
    /* @__PURE__ */ jsx("p", { id: "email", children: email })
  ] });
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Page$2,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const meta = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};
function Index() {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h1", { children: "Welcome to Remix" }),
    /* @__PURE__ */ jsx("h2", { children: "...powered by AdonisJS 😎" }),
    /* @__PURE__ */ jsxs("ul", { children: [
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { target: "_blank", href: "https://remix.run/tutorials/blog", rel: "noreferrer", children: "15m Quickstart Blog Tutorial" }) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { target: "_blank", href: "https://remix.run/tutorials/jokes", rel: "noreferrer", children: "Deep Dive Jokes App Tutorial" }) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { target: "_blank", href: "https://remix.run/docs", rel: "noreferrer", children: "Remix Docs" }) })
    ] })
  ] });
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const loader$1 = async () => {
  return defer({
    lazyPosts: new Promise((resolve) => {
      setTimeout(() => {
        resolve(["Post 1", "Post 2"]);
      }, 100);
    })
  });
};
function Page$1() {
  const { lazyPosts } = useLoaderData();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("h1", { children: "Posts" }),
    /* @__PURE__ */ jsx(
      Suspense,
      {
        fallback: /* @__PURE__ */ jsx("div", { id: "loader", role: "alert", "aria-live": "assertive", "aria-busy": "true", children: "Loading..." }),
        children: /* @__PURE__ */ jsx(Await, { resolve: lazyPosts, children: (posts) => posts.map((p) => /* @__PURE__ */ jsx("div", { className: "post", children: p }, p)) })
      }
    )
  ] });
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Page$1,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
const loader = ({ request }) => {
  const params = new URL(request.url).searchParams;
  return json({
    message: params.get("message")
  });
};
function Page() {
  const { message } = useLoaderData();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("h1", { children: "Echo" }),
    /* @__PURE__ */ jsx("p", { id: "message", children: message })
  ] });
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Page,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/entry.client-YQlLBwrz.js", "imports": ["/jsx-runtime-eUkJMm6l.js", "/index-FZYdsAyj.js", "/components-8brcXnEx.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/root-bn9wIkKk.js", "imports": ["/jsx-runtime-eUkJMm6l.js", "/index-FZYdsAyj.js", "/components-8brcXnEx.js"], "css": [] }, "routes/trigger_thrown_response": { "id": "routes/trigger_thrown_response", "parentId": "root", "path": "trigger_thrown_response", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/trigger_thrown_response-UAAkdL4X.js", "imports": ["/jsx-runtime-eUkJMm6l.js", "/index-FZYdsAyj.js", "/error_boundary-T-ppZwYN.js"], "css": [] }, "routes/resolve_container": { "id": "routes/resolve_container", "parentId": "root", "path": "resolve_container", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/resolve_container-vOj6BmCz.js", "imports": ["/jsx-runtime-eUkJMm6l.js", "/index-FZYdsAyj.js", "/components-8brcXnEx.js"], "css": [] }, "routes/webhooks.payment": { "id": "routes/webhooks.payment", "parentId": "root", "path": "webhooks/payment", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/webhooks.payment-w40geAFS.js", "imports": [], "css": [] }, "routes/trigger_error": { "id": "routes/trigger_error", "parentId": "root", "path": "trigger_error", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/trigger_error-UAAkdL4X.js", "imports": ["/jsx-runtime-eUkJMm6l.js", "/index-FZYdsAyj.js", "/error_boundary-T-ppZwYN.js"], "css": [] }, "routes/feedback": { "id": "routes/feedback", "parentId": "root", "path": "feedback", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/feedback-GCujQbUc.js", "imports": ["/jsx-runtime-eUkJMm6l.js", "/index-FZYdsAyj.js", "/components-8brcXnEx.js"], "css": [] }, "routes/profile": { "id": "routes/profile", "parentId": "root", "path": "profile", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/profile-zm_Znczr.js", "imports": ["/jsx-runtime-eUkJMm6l.js", "/index-FZYdsAyj.js", "/components-8brcXnEx.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/_index-TgZEPvOu.js", "imports": ["/jsx-runtime-eUkJMm6l.js"], "css": [] }, "routes/posts": { "id": "routes/posts", "parentId": "root", "path": "posts", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/posts-wpQ-0iab.js", "imports": ["/jsx-runtime-eUkJMm6l.js", "/index-FZYdsAyj.js", "/components-8brcXnEx.js"], "css": [] }, "routes/echo": { "id": "routes/echo", "parentId": "root", "path": "echo", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/echo-6b5_jeBp.js", "imports": ["/jsx-runtime-eUkJMm6l.js", "/index-FZYdsAyj.js", "/components-8brcXnEx.js"], "css": [] } }, "url": "/manifest-09adfe2b.js", "version": "09adfe2b" };
const mode = "production";
const assetsBuildDirectory = "public/assets/remix/client/client";
const basename = "/";
const future = { "v3_fetcherPersist": false, "v3_relativeSplatPath": false, "v3_throwAbortReason": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/trigger_thrown_response": {
    id: "routes/trigger_thrown_response",
    parentId: "root",
    path: "trigger_thrown_response",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/resolve_container": {
    id: "routes/resolve_container",
    parentId: "root",
    path: "resolve_container",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/webhooks.payment": {
    id: "routes/webhooks.payment",
    parentId: "root",
    path: "webhooks/payment",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/trigger_error": {
    id: "routes/trigger_error",
    parentId: "root",
    path: "trigger_error",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/feedback": {
    id: "routes/feedback",
    parentId: "root",
    path: "feedback",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/profile": {
    id: "routes/profile",
    parentId: "root",
    path: "profile",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route7
  },
  "routes/posts": {
    id: "routes/posts",
    parentId: "root",
    path: "posts",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/echo": {
    id: "routes/echo",
    parentId: "root",
    path: "echo",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
