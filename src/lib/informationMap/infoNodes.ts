import { Node, XYPosition } from '@xyflow/react';

interface FlowNodesType extends Node<InformationNodeType> {
  id: string;
  data: InformationNodeType;
  position: XYPosition;
}

export const convertNodeInfoToNode = (
  id: string,
  info: InformationNodeType,
): FlowNodesType => ({
  id,
  data: info,
  position: {
    x: 0,
    y: 0,
  },
});

export type DirectionType = 'LR' | 'TB' | 'BT' | 'RL'; // left to right, top to bottom, etc.

export type InformationNodeType = {
  name: string;
  description?: string;
  details: Record<string, InformationNodeDetails>;
  direction?: string; // reserved field
};

type InformationNodeDetails = {
  label?: string;
  body: string;
  type: DetailsType;
};

type DetailsType = 'procedural' | 'analogous' | 'conceptual' | 'evidence' | 'reference';

export type InformationNodesType = Record<string, InformationNodeType>;

export type InformationNodeKeysType = keyof typeof InformationNodes | 'root';

export const getInfoNodesByPosition = (
  nodesPositions: Record<InformationNodeKeysType, XYPosition>,
): FlowNodesType[] =>
  Object.keys(nodesPositions).map(
    (key) =>
      ({
        id: key,
        data: InformationNodes[key],
        position: nodesPositions[key],
      }) as FlowNodesType,
  );

export const InformationNodes: InformationNodesType = {
  ui_library: {
    name: 'UI Library',
    description: 'A collection of reusable UI components for building user interfaces.',
    details: {
      '0': {
        label: 'Popular Third-Party Libraries',
        body: 'Commonly used UI libraries include Material-UI, Ant Design, Tailwind CSS, and Chakra UI, which provide a mix of pre-designed components and theming systems for React applications.',
        type: 'reference',
      },
      '1': {
        label: 'Weaknesses of Third-Party Libraries',
        body: 'Third-party libraries often introduce a learning curve, limited customizability, potential performance overhead, and reliance on library maintainers for updates and bug fixes. These issues can affect long-term maintainability.',
        type: 'conceptual',
      },
      '2': {
        label: 'Weakness: Performance Overhead',
        body: 'Some libraries bundle many unused components, increasing the size of the final build if tree-shaking isn’t properly configured.',
        type: 'evidence',
      },
      '3': {
        label: 'Weakness: Styling Constraints',
        body: 'Libraries with pre-designed themes (e.g., Material-UI, Ant Design) may make it challenging to fully achieve unique or custom designs without extensive overrides.',
        type: 'conceptual',
      },
      '4': {
        label: 'Weakness: Maintenance Risk',
        body: 'Relying on third-party libraries can be risky if the library becomes deprecated or is not actively maintained, requiring migration or additional effort to manage updates.',
        type: 'conceptual',
      },
    },
  },
  mantine_ui: {
    name: 'Mantine UI',
    description: 'a unique UI library focused on developer experience and customization.',
    details: {
      '0': {
        label: 'Mantine Hooks',
        body: 'Mantine includes various untility libraries such as Mantine Hooks which contains an incredibly library of useful hooks.',
        type: 'reference',
      },
      '1': {
        label: 'React-JSS',
        body: 'Mantine uses React-JSS as its core styling solution, enabling dynamic styling with JavaScript and supporting powerful theming capabilities.',
        type: 'conceptual',
      },
      '2': {
        label: 'Color System: 10 Shades',
        body: 'Mantine’s color palette is split into 10 shades (e.g., blue[0]-blue[9]), where 0 is the lightest and 9 is the darkest. This granular system ensures flexibility in creating consistent designs with varying levels of contrast.',
        type: 'evidence',
      },
      '3': {
        label: 'Props: color vs c',
        body: 'The `color` prop is used to specify a named color (e.g., "blue", "red") from the theme, while the shorthand `c` prop provides a lightweight alternative for quick styling, particularly in text components.',
        type: 'procedural',
      },
      '4': {
        label: 'Virtual Colors',
        body: 'Mantine supports virtual colors, which are derived from the base palette but adjusted for specific themes or use cases. This feature allows for dynamic generation of colors that fit seamlessly with existing designs.',
        type: 'conceptual',
      },
      '5': {
        label: 'Custom Themes',
        body: 'Developers can extend the Mantine theme to create custom palettes, adjust spacing, and configure components globally.',
        type: 'procedural',
      },
    },
  },
  ui_theme_pattern: {
    name: 'UI Theme Pattern',
    description: 'Patterns and strategies for managing themes in a React app.',
    details: {
      '0': {
        label: 'Theme Provider',
        body: 'Most libraries, like Mantine, Material-UI, and Chakra UI, use a `ThemeProvider` component to wrap the application. This provider injects theme values (e.g., colors, spacing, typography) into components via context.',
        type: 'procedural',
      },
      '1': {
        label: 'Design Tokens',
        body: 'A theme pattern is often built around design tokens, such as `primaryColor`, `fontSizes`, or `borderRadius`. These tokens abstract design values to ensure consistency and scalability.',
        type: 'conceptual',
      },
      '2': {
        label: 'Dark and Light Modes',
        body: 'Themes typically support toggling between light and dark modes. This involves defining separate palettes for each mode and dynamically switching based on user preference or a system setting.',
        type: 'conceptual',
      },
      '3': {
        label: 'Global vs Component-Level Theming',
        body: 'While global theming provides consistency across the app, some libraries (e.g., Mantine) allow overriding themes at the component level for granular customization.',
        type: 'analogous',
      },
      '4': {
        label: 'Dynamic Theming',
        body: 'Dynamic theming enables runtime updates to the theme, such as changing colors or typography based on user input or a saved preference.',
        type: 'procedural',
      },
      '5': {
        label: 'CSS Variables and Performance',
        body: 'Libraries like Mantine and Tailwind CSS leverage CSS variables to manage themes efficiently, enabling quick updates to styles without re-rendering components.',
        type: 'evidence',
      },
      '6': {
        label: 'Limitations of UI Theme Patterns',
        body: 'Despite their advantages, UI theme patterns can increase complexity in codebases. Overriding default styles and maintaining consistency in a large application may require additional effort.',
        type: 'conceptual',
      },
    },
  },
  theme_runtime_config: {
    name: 'Theme runtime config',
    description:
      'The boilerplate contains a file for a runtime configuration, which has fields defining various UI theme fields.',
    details: {},
  },
  vite: {
    name: 'Vite',
    description:
      'Vite is a modern build tool that leverages native ES modules and advanced bundling strategies to deliver a fast and efficient development experience.',
    details: {
      '0': {
        label: 'Impact on Runtime',
        body: 'Vite reduces memory usage and CPU load during development by avoiding full bundling, providing a smoother experience even on low-resource systems.',
        type: 'evidence',
      },
      '1': {
        label: 'Impact on Build Time',
        body: 'Vite significantly shortens build times by leveraging ESBuild for preprocessing and Rollup for optimized bundling, ensuring smaller and faster production outputs.',
        type: 'evidence',
      },
      '2': {
        label: 'Improved Developer Experience',
        body: 'Near-instant reloads, smooth HMR, and minimal configuration provide a better experience for React developers.',
        type: 'conceptual',
      },
      '3': {
        label: 'Native ES Modules',
        body: 'Vite serves JavaScript files as native ES modules in the browser, bypassing the need for bundling during development.',
        type: 'conceptual',
      },
      '4': {
        label: 'Hot Module Replacement (HMR)',
        body: 'Vite provides near-instant hot updates, allowing React components to reflect changes without a full page reload, ensuring a fast feedback loop.',
        type: 'procedural',
      },
      '5': {
        label: 'On-Demand Compilation',
        body: 'Instead of bundling the entire app, Vite compiles and serves only the files requested by the browser, significantly reducing startup time in development.',
        type: 'evidence',
      },
      '6': {
        label: 'ESBuild for Dependency Pre-Bundling',
        body: 'Vite uses ESBuild, a high-performance bundler written in Go, to pre-bundle dependencies in `node_modules` at incredible speeds, reducing cold-start times.',
        type: 'procedural',
      },
      '7': {
        label: 'Rollup for Production',
        body: 'For production builds, Vite uses Rollup under the hood, ensuring advanced optimizations like tree-shaking and code splitting.',
        type: 'procedural',
      },
      '8': {
        label: 'Optimized Output',
        body: 'Vite’s production builds ensure efficient output with minimized bundle sizes, faster page loads, and better performance.',
        type: 'evidence',
      },
      '9': {
        label: 'TypeScript Support',
        body: 'Vite provides built-in support for TypeScript, simplifying the development process for TypeScript-based React projects.',
        type: 'reference',
      },
      '10': {
        label: 'Potential Compatibility Issues',
        body: 'Some legacy plugins or libraries might not support Vite’s ESM-based architecture, requiring alternative solutions or workarounds.',
        type: 'conceptual',
      },
    },
  },
  build_time: {
    name: 'Build Time',
    description: '',
    details: {},
  },
  environment_variables: {
    name: 'Environment Variables',
    description: '',
    details: {},
  },
  server_side_rendering: {
    name: 'Server-side Rendering',
    description:
      'Server-Side Rendering involves generating the HTML for a page on the server based on a client’s request, sending the fully rendered HTML to the browser, and hydrating it with JavaScript for interactivity.',
    details: {
      '0': {
        label: 'How SSR Works',
        body: 'When a user requests a page, the server renders the React components to HTML, sends it to the client, and the browser downloads and executes JavaScript to enable interactivity.',
        type: 'procedural',
      },
      '1': {
        label: 'Benefits of SSR',
        body: 'Improves SEO by delivering pre-rendered content for crawlers, reduces the time to first meaningful paint (TTFMP), and enhances performance for users with slower connections.',
        type: 'evidence',
      },
      '2': {
        label: 'Hydration Process',
        body: 'After the HTML is served, React "hydrates" it by attaching event listeners and making the page interactive, effectively merging server-rendered HTML with client-side React.',
        type: 'procedural',
      },
      '3': {
        label: 'Use Cases',
        body: 'Commonly used for content-heavy websites, blogs, eCommerce platforms, and applications where SEO and performance are critical.',
        type: 'analogous',
      },
      '4': {
        label: 'Limitations of SSR',
        body: 'Increases server load and complexity, can lead to slower time-to-interactive (TTI), and may require caching strategies to scale effectively.',
        type: 'conceptual',
      },
      '5': {
        label: 'Next.js and SSR',
        body: 'Next.js is a popular framework for SSR with React, offering features like automatic page rendering, dynamic routing, and static-site generation (SSG).',
        type: 'reference',
      },
      '6': {
        label: 'Comparing SSR to CSR and SSG',
        body: 'CSR (Client-Side Rendering) relies on JavaScript to render pages in the browser, while SSG (Static-Site Generation) generates static HTML at build time. SSR strikes a balance between dynamic content and pre-rendering.',
        type: 'analogous',
      },
      '7': {
        label: 'Caching Strategies for SSR',
        body: 'SSR applications often use caching techniques, such as CDN caching or server-level caching, to improve response times and reduce server overhead.',
        type: 'procedural',
      },
      '8': {
        label: 'SEO Impact',
        body: 'By delivering fully-rendered HTML, SSR ensures that web crawlers can index the content effectively, improving search engine rankings.',
        type: 'evidence',
      },
    },
  },
  react: {
    name: 'React',
    description:
      'React is a declarative, component-based JavaScript library used to create dynamic and interactive user interfaces for web and mobile applications.',
    details: {
      '0': {
        label: 'Core Concepts',
        body: 'Key concepts in React include components, props, state, and the virtual DOM, which together enable efficient UI updates and reusability.',
        type: 'conceptual',
      },
      '1': {
        label: 'JSX Syntax',
        body: 'React uses JSX, a syntax extension for JavaScript, to define the structure and appearance of components in a way that resembles HTML.',
        type: 'procedural',
      },
      '2': {
        label: 'Virtual DOM',
        body: 'React’s Virtual DOM improves performance by calculating the minimal number of DOM updates needed to render changes, rather than manipulating the actual DOM directly.',
        type: 'evidence',
      },
      '3': {
        label: 'Component-Based Architecture',
        body: 'Applications in React are built using reusable components, making code modular, maintainable, and easier to test.',
        type: 'conceptual',
      },
      '4': {
        label: 'State and Props',
        body: 'State is used to manage dynamic data within components, while props allow data to be passed between components for communication.',
        type: 'conceptual',
      },
      '5': {
        label: 'Hooks',
        body: 'React Hooks, such as `useState` and `useEffect`, allow developers to manage state and side effects in functional components without using class components.',
        type: 'procedural',
      },
      '6': {
        label: 'React Ecosystem',
        body: 'The React ecosystem includes libraries like React Router for routing, React Query for data fetching, and tools like Redux for state management.',
        type: 'reference',
      },
      '7': {
        label: 'Server-Side Rendering (SSR) with React',
        body: 'React supports SSR through frameworks like Next.js, which enhance performance and SEO by pre-rendering HTML on the server.',
        type: 'analogous',
      },
      '8': {
        label: 'React Native',
        body: 'React Native extends React to build cross-platform mobile applications using JavaScript and React principles.',
        type: 'analogous',
      },
      '9': {
        label: 'Advantages of React',
        body: 'React’s virtual DOM, component reusability, and active community support make it an efficient and widely-used library for building modern applications.',
        type: 'evidence',
      },
      '10': {
        label: 'Limitations of React',
        body: 'React requires additional configuration for routing, state management, and SSR. Managing complex state in large applications can also be challenging.',
        type: 'conceptual',
      },
    },
  },
  react_component_lifecycle: {
    name: 'React Component Lifecycle',
    description:
      'The React component lifecycle refers to the sequence of phases a component experiences, including mounting, updating, and unmounting, with specific methods triggered at each stage.',
    details: {
      '0': {
        label: 'Lifecycle Phases',
        body: 'React components have three main phases: Mounting (initialization), Updating (state/prop changes), and Unmounting (cleanup).',
        type: 'conceptual',
      },
      '1': {
        label: 'Mounting Phase',
        body: '`componentDidMount` (class components) or `useEffect` (functional components) is used for tasks like data fetching, subscriptions, or DOM updates after the component renders.',
        type: 'procedural',
      },
      '2': {
        label: 'Updating Phase',
        body: '`componentDidUpdate` (class components) or `useEffect` with dependencies (functional components) is used to respond to prop or state changes. Common tasks include recalculations, re-fetching data, or DOM updates.',
        type: 'procedural',
      },
      '3': {
        label: 'Unmounting Phase',
        body: '`componentWillUnmount` (class components) or the cleanup function of `useEffect` (functional components) handles tasks like unsubscribing, canceling network requests, or clearing timers.',
        type: 'procedural',
      },
      '4': {
        label: 'React Hooks and Lifecycle',
        body: 'React Hooks, such as `useEffect`, provide a functional way to handle lifecycle events. Developers can implement logic for mounting, updating, and unmounting within a single hook.',
        type: 'conceptual',
      },
      '5': {
        label: 'Lifecycle Methods in Class Components',
        body: 'Key lifecycle methods include `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`. Less common methods include `shouldComponentUpdate` and `getDerivedStateFromProps`.',
        type: 'reference',
      },
      '6': {
        label: 'Functional Components vs. Class Components',
        body: 'In functional components, lifecycle methods are replaced by hooks like `useEffect`, offering a cleaner and more composable way to handle side effects and updates.',
        type: 'analogous',
      },
      '7': {
        label: 'Common Mistakes with Lifecycle',
        body: 'Common errors include missing cleanup in `useEffect`, causing memory leaks, or overusing `componentDidUpdate` for unnecessary re-renders.',
        type: 'conceptual',
      },
      '8': {
        label: 'Performance Optimization in Lifecycle',
        body: '`shouldComponentUpdate` (class components) or `React.memo` (functional components) helps prevent unnecessary re-renders by controlling updates based on prop/state changes.',
        type: 'evidence',
      },
      '9': {
        label: 'Impact on User Experience',
        body: 'Proper lifecycle management ensures smooth UI updates, avoids memory leaks, and optimizes performance, directly improving user experience.',
        type: 'evidence',
      },
    },
  },
  firebase: {
    name: 'Firebase',
    description:
      'Firebase is a Backend-as-a-Service (BaaS) platform that provides tools and services for building, deploying, and scaling applications without needing extensive backend infrastructure.',
    details: {
      '0': {
        label: 'Core Features',
        body: 'Firebase includes services like Realtime Database, Firestore, Authentication, Cloud Functions, Storage, and Hosting, all integrated into a single platform.',
        type: 'reference',
      },
      '1': {
        label: 'Firestore vs. Realtime Database',
        body: 'Firestore is a flexible, scalable, NoSQL database optimized for complex queries, while Realtime Database offers low-latency data sync for simpler data structures.',
        type: 'analogous',
      },
      '2': {
        label: 'Authentication',
        body: 'Firebase Authentication supports multiple sign-in methods, including email/password, OAuth (e.g., Google, Facebook), and anonymous login, making user management easier.',
        type: 'procedural',
      },
      '3': {
        label: 'Serverless Backend with Cloud Functions',
        body: 'Firebase Cloud Functions allow developers to run backend code in response to events triggered by Firebase services or HTTPS requests, eliminating the need for server management.',
        type: 'conceptual',
      },
      '4': {
        label: 'Realtime Data Sync',
        body: 'Both Firestore and Realtime Database enable real-time updates between clients and servers, ensuring that data changes are reflected instantly across devices.',
        type: 'evidence',
      },
      '5': {
        label: 'Hosting and Deployment',
        body: 'Firebase Hosting offers fast, secure hosting for web apps and static content with automatic HTTPS, custom domains, and continuous deployment through Git integrations.',
        type: 'procedural',
      },
      '6': {
        label: 'Analytics and Performance Monitoring',
        body: 'Firebase Analytics and Performance Monitoring provide insights into app usage and behavior, enabling developers to optimize user experience and app performance.',
        type: 'conceptual',
      },
      '7': {
        label: 'Security with Firebase Rules',
        body: 'Firestore and Realtime Database use declarative security rules to control access to data, ensuring users can only access or modify authorized resources.',
        type: 'procedural',
      },
      '8': {
        label: 'Benefits of Firebase',
        body: 'Firebase accelerates development with prebuilt backend services, supports scalability, and integrates seamlessly with Google Cloud for extended functionality.',
        type: 'evidence',
      },
      '9': {
        label: 'Limitations of Firebase',
        body: 'While Firebase simplifies development, it can lead to vendor lock-in, has limited querying capabilities compared to relational databases, and costs can scale quickly with usage.',
        type: 'conceptual',
      },
      '10': {
        label: 'Use Cases for Firebase',
        body: 'Ideal for real-time chat apps, collaborative tools, eCommerce platforms, and MVPs, Firebase shines in projects requiring rapid development and deployment.',
        type: 'analogous',
      },
    },
  },
  progressive_web_application: {
    name: 'Progressive Web App',
    description:
      'Web applications that deliver app-like experiences on mobile and desktop through modern web capabilities like offline support, installability, and push notifications.',
    details: {
      '0': {
        label: 'Core Features of a PWA',
        body: 'Key features include offline access, fast loading, responsive design, push notifications, and the ability to be installed on the user’s device.',
        type: 'reference',
      },
      '1': {
        label: 'Manifest File',
        body: 'A PWA requires a `manifest.json` file to define app metadata like the app name, icons, theme color, and display mode.',
        type: 'procedural',
      },
      '2': {
        label: 'Offline Support',
        body: 'PWAs use service workers to cache assets and serve them offline, ensuring availability even without an internet connection.',
        type: 'evidence',
      },
      '3': {
        label: 'SEO and Accessibility',
        body: 'PWAs are discoverable via search engines and provide an inclusive experience with responsive design and support for assistive technologies.',
        type: 'conceptual',
      },
      '4': {
        label: 'Benefits of PWAs',
        body: 'PWAs bridge the gap between web and native apps, offering improved performance, reduced development costs, and cross-platform compatibility.',
        type: 'evidence',
      },
      '5': {
        label: 'Limitations of PWAs',
        body: 'Certain native features, such as access to advanced hardware APIs, may not be fully supported depending on the browser or operating system.',
        type: 'conceptual',
      },
    },
  },
  manifest: {
    name: 'Manifest',
    description: '',
    details: {},
  },
  workbox: {
    name: 'Workbox',
    description:
      'A set of libraries and tools by Google that simplifies creating and managing service workers for Progressive Web Applications.',
    details: {
      '0': {
        label: 'Core Features',
        body: 'Workbox includes tools for caching strategies, precaching, runtime caching, background sync, and integration with Google Analytics.',
        type: 'reference',
      },
      '1': {
        label: 'Precaching with Workbox',
        body: 'Workbox allows developers to precache static assets during the build process, ensuring offline availability and faster loading times.',
        type: 'procedural',
      },
      '2': {
        label: 'Runtime Caching',
        body: 'Workbox supports runtime caching strategies, such as network-first, cache-first, and stale-while-revalidate, to manage dynamic content.',
        type: 'procedural',
      },
      '3': {
        label: 'Integrating with Build Tools',
        body: 'Workbox integrates with tools like Webpack and Vite through plugins to automate the creation and management of service workers.',
        type: 'procedural',
      },
      '4': {
        label: 'Benefits of Workbox',
        body: 'Workbox simplifies service worker creation, reduces boilerplate code, and provides best practices for caching and performance optimization.',
        type: 'evidence',
      },
      '5': {
        label: 'Limitations of Workbox',
        body: 'While Workbox automates many tasks, it may abstract too much for developers needing fine-grained control over service workers.',
        type: 'conceptual',
      },
    },
  },
  service_worker: {
    name: 'Service Worker',
    description:
      'A background script that acts as a proxy between the browser and the network, enabling features like offline support, caching, and push notifications.',
    details: {
      '0': {
        label: 'Lifecycle of a Service Worker',
        body: 'The service worker lifecycle includes installation, activation, and the idle state. Events like `install` and `activate` allow developers to manage caching and updates.',
        type: 'procedural',
      },
      '1': {
        label: 'Cache API',
        body: 'The Cache API is used within service workers to store resources locally, enabling offline access and faster load times for repeated visits.',
        type: 'procedural',
      },
      '2': {
        label: 'Push Notifications',
        body: 'Service workers enable push notifications by acting as an intermediary between the server and the client, even when the app is not active.',
        type: 'evidence',
      },
      '3': {
        label: 'Offline Support',
        body: 'By intercepting network requests and serving cached resources, service workers ensure apps remain functional without an internet connection.',
        type: 'evidence',
      },
      '4': {
        label: 'Security Requirements',
        body: 'Service workers only run on HTTPS or localhost to ensure secure communication and prevent man-in-the-middle attacks.',
        type: 'conceptual',
      },
      '5': {
        label: 'Limitations of Service Workers',
        body: 'Service workers cannot access the DOM directly, and their functionality depends on browser support and user consent for features like push notifications.',
        type: 'conceptual',
      },
    },
  },
};

export const allInformationNodes = Object.keys(InformationNodes).map(
  (key) =>
    ({
      id: key,
      data: InformationNodes[key],
      position: { x: 0, y: 0 },
    }) as FlowNodesType,
);
