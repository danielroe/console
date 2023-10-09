import React from "react";
import {
  Img,
  Row,
  Html,
  Link,
  Body,
  Head,
  Font,
  Button,
  Column,
  Preview,
  Heading,
  Section,
  Container,
  Hr as REHr,
  Text as REText,
  HrProps as REHrProps,
  TextProps as RETextProps,
} from "@react-email/components";

const LOCAL_ASSETS_URL = "/static";

const unit = 16;

const GREY_COLOR = [
  "#1A1A2E", //0
  "#2F2F41", //1
  "#444454", //2
  "#585867", //3
  "#6D6D7A", //4
  "#82828D", //5
  "#9797A0", //6
  "#ACACB3", //7
  "#C1C1C6", //8
  "#D5D5D9", //9
  "#EAEAEC", //10
  "#FFFFFF", //11
];

const BLUE_COLOR = "#395C6B";
const TEXT_COLOR = GREY_COLOR[0];
const SECONDARY_COLOR = GREY_COLOR[5];
const DIMMED_COLOR = GREY_COLOR[7];
const DIVIDER_COLOR = GREY_COLOR[10];
const BACKGROUND_COLOR = "#F0F0F1";
const SURFACE_COLOR = DIVIDER_COLOR;
const SURFACE_DIVIDER_COLOR = GREY_COLOR[9];

const body = {
  background: BACKGROUND_COLOR,
};

const container = {};

const frame = {
  padding: `${unit * 1.5}px`,
  border: `1px solid ${SURFACE_DIVIDER_COLOR}`,
  background: "#FFF",
  borderRadius: "6px",
  boxShadow: `0 1px 2px rgba(0,0,0,0.03),
              0 2px 4px rgba(0,0,0,0.03),
              0 2px 6px rgba(0,0,0,0.03)`,
};

const textColor = {
  color: TEXT_COLOR,
};

const code = {
  fontFamily: "IBM Plex Mono, mono-space",
};

const headingHr = {
  margin: `${unit}px 0`,
};

const buttonPrimary = {
  ...code,
  color: "#FFF",
  borderRadius: "4px",
  background: BLUE_COLOR,
  fontSize: "12px",
  fontWeight: 500,
};

const compactText = {
  margin: "0 0 2px",
};

const issueBreadcrumb = {
  fontSize: "14px",
  color: SECONDARY_COLOR,
};

const issueBreadcrumbSeparator = {
  color: DIVIDER_COLOR,
};

const issueHeading = {
  ...code,
  fontSize: "22px",
  fontWeight: 500,
};

const sectionLabel = {
  ...code,
  ...compactText,
  letterSpacing: "0.5px",
  fontSize: "13px",
  fontWeight: 500,
  color: DIMMED_COLOR,
};

const stacktraceContainer = {
  padding: `${unit * 0.75}px ${unit}px`,
  borderRadius: "5px",
  background: SURFACE_COLOR,
};

const stacktraceFrame = {
  ...code,
  fontSize: "13px",
  color: DIMMED_COLOR,
};
const stacktraceFrameFileImportant = {
  ...stacktraceFrame,
  color: TEXT_COLOR,
  fontWeight: 500,
};
const stacktraceFramePositionImportant = {
  ...stacktraceFrame,
  color: SECONDARY_COLOR,
  fontWeight: 500,
};
const stacktraceFrameContext = {
  ...code,
  margin: "4px 0",
  fontSize: "12px",
  color: DIMMED_COLOR,
};
const stacktraceFrameContextImportant = {
  ...stacktraceFrameContext,
  color: TEXT_COLOR,
  fontWeight: 500,
};

const footerLink = {
  fontSize: "14px",
};

function countLeadingSpaces(str: string) {
  let count = 0;
  for (let char of str) {
    if (char === " ") {
      count++;
    } else if (char === "\t") {
      count += 2;
    } else {
      break;
    }
  }
  return count;
}

function Text(props: RETextProps) {
  return <REText {...props} style={{ ...textColor, ...props.style }} />;
}

function Hr(props: REHrProps) {
  return (
    <REHr
      {...props}
      style={{ borderTop: `1px solid ${DIVIDER_COLOR}`, ...props.style }}
    />
  );
}

function SurfaceHr(props: REHrProps) {
  return (
    <REHr
      {...props}
      style={{
        borderTop: `1px solid ${SURFACE_DIVIDER_COLOR}`,
        ...props.style,
      }}
    />
  );
}

function Fonts({ assetsUrl }: { assetsUrl: string }) {
  return (
    <>
      <Font
        fontFamily="IBM Plex Mono"
        fallbackFontFamily="mono-space"
        webFont={{
          url: `${assetsUrl}/ibm-plex-mono-latin-400.woff2`,
          format: "woff2",
        }}
        fontWeight="400"
        fontStyle="normal"
      />
      <Font
        fontFamily="IBM Plex Mono"
        fallbackFontFamily="mono-space"
        webFont={{
          url: `${assetsUrl}/ibm-plex-mono-latin-500.woff2`,
          format: "woff2",
        }}
        fontWeight="500"
        fontStyle="normal"
      />
      <Font
        fontFamily="IBM Plex Mono"
        fallbackFontFamily="mono-space"
        webFont={{
          url: `${assetsUrl}/ibm-plex-mono-latin-700.woff2`,
          format: "woff2",
        }}
        fontWeight="700"
        fontStyle="normal"
      />
      <Font
        fontFamily="Rubik"
        fallbackFontFamily="Helvetica, Arial, sans-serif"
        webFont={{
          url: `${assetsUrl}/rubik-latin.woff2`,
          format: "woff2",
        }}
        fontWeight="400 500 600 700"
        fontStyle="normal"
      />
    </>
  );
}

function SplitString({ text, split }: { text: string; split: number }) {
  const segments: JSX.Element[] = [];
  for (let i = 0; i < text.length; i += split) {
    segments.push(<>{text.slice(i, i + split)}</>);
    if (i + split < text.length) {
      segments.push(<wbr key={i + "wbr"} />);
    }
  }
  return <>{segments}</>;
}

function FormattedCode({ text, split = 60, indent = 0 }) {
  const renderProcessedString = () => {
    let elements: JSX.Element[] = [];
    let count = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      if (char === " ") {
        elements.push(<>&nbsp;</>);
      } else if (char === "\t") {
        elements.push(
          <>
            <>&nbsp;</>
            <>&nbsp;</>
          </>
        );
      } else {
        elements.push(<>{char}</>);
      }

      count++;

      // Insert <wbr /> with given indent every x characters
      if (count === split) {
        elements.push(<wbr key={i} />, ...Array(indent).fill(<>&nbsp;</>));
        count = 0;
      }
    }

    return elements;
  };

  return <>{renderProcessedString()}</>;
}

type StacktraceContext = {
  line: string;
  index: number;
};
type StacktraceFrame = {
  file?: string;
  raw?: string;
  line?: number;
  column?: number;
  important?: boolean;
  context?: StacktraceContext[];
};

function renderStacktraceFrameContext(context: StacktraceContext[]) {
  const minLeadingSpaces = Math.min(
    ...context.map((row) => countLeadingSpaces(row.line))
  );
  const maxIndexLength = Math.max(
    ...context.map((row) => row.index.toString().length)
  );

  function padStringToEnd(input: string, desiredLength: number) {
    const numberOfSpaces = desiredLength - input.length;
    return input + " ".repeat(numberOfSpaces);
  }

  return (
    <>
      <Row>
        <Column>
          <SurfaceHr />
        </Column>
      </Row>
      {context.map((row, index) => (
        <Row key={index}>
          <Column>
            <span
              style={
                index === 3
                  ? stacktraceFrameContextImportant
                  : stacktraceFrameContext
              }
            >
              <FormattedCode
                split={68}
                indent={maxIndexLength + 2}
                text={`${padStringToEnd(
                  row.index.toString(),
                  maxIndexLength
                )}  ${row.line.substring(minLeadingSpaces)}`}
              />
            </span>
          </Column>
        </Row>
      ))}
    </>
  );
}

interface IssueEmailProps {
  url: string;
  app: string;
  name: string;
  stage: string;
  message: string;
  assetsUrl: string;
  settingsUrl: string;
  stacktrace?: StacktraceFrame[];
}
const IssueEmail = ({
  app = "console",
  stage = "production",
  name = "NoSuchBucketIsAReallyLongExceptionNameThatShouldBeTruncated",
  assetsUrl = LOCAL_ASSETS_URL,
  settingsUrl = "https://console.sst.dev/sst/console/production/settings",
  message = "ThisisareallylongmessagethatshouldbetruncatedBecauseItDoesNotHaveABreakAndWillOverflow.",
  url = "https://console.sst.dev/sst/console/production/issues/pioksmvi6x2sa9zdljvn8ytw",
  stacktrace = [
    {
      raw: "_Connection.execute (/Users/jayair/Desktop/Projects/console/node_modules/.pnpm/@planetscale+database@1.11.0/node_modules/@planetscale/database/dist/index.js:92:19)",
    },
    {
      raw: "  at processTicksAndRejections (node:internal/process/task_queues:96:5)",
    },
    {
      file: "node_modules/.pnpm/@smithy+smithy-client@2.1.3/node_modules/@smithy/smithy-client/dist-es/default-error-handler.js",
      line: 23,
      column: 17,
    },
    {
      file: "node_modules/.pnpm/@smithy+smithy-client@2.1.3/node_modules/@smithy/smithy-client/dist-es/operation.js",
      line: 49,
      column: 28,
    },
    {
      file: "packages/core/src/issue/index.ts",
      line: 101,
      column: 35,
      important: true,
      context: [
        {
          line: "    const key = `stackMetadata/path/that/is/too/long/and/will/overflow/app.${row.app}/stage.${row.stage}/`;",
          index: 98,
        },
        {
          line: '    console.log("listing", key, "for", bucket);',
          index: 99,
        },
        {
          line: "    const list = await s3",
          index: 100,
        },
        {
          line: "      .send(",
          index: 101,
        },
        {
          line: "        new ListObjectsV2Command({",
          index: 102,
        },
        {
          line: "          Prefix: key,",
          index: 103,
        },
        {
          line: "          Bucket: bucket,",
          index: 104,
        },
      ],
    },
  ],
}: IssueEmailProps) => {
  return (
    <Html lang="en">
      <Head>
        <title>{`SST — ${name}: ${message}`}</title>
      </Head>
      <Fonts assetsUrl={assetsUrl} />
      <Preview>
        SST — {name}: {message}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={frame}>
            <Row>
              <Column>
                <Img
                  height="32"
                  alt="SST Logo"
                  src={`${assetsUrl}/sst-logo.png`}
                />
              </Column>
              <Column align="right">
                <Button pX={18} pY={12} style={buttonPrimary} href={url}>
                  <span style={code}>View Issue</span>
                </Button>
              </Column>
            </Row>

            <Row style={headingHr}>
              <Column>
                <Hr />
              </Column>
            </Row>

            <Section>
              <Text style={{ ...compactText, ...issueBreadcrumb }}>
                <span>{app}</span>
                <span style={{ ...code, ...issueBreadcrumbSeparator }}>
                  &nbsp;/&nbsp;
                </span>
                <span>{stage}</span>
              </Text>
              <Text style={{ ...issueHeading, ...compactText }}>
                <Link style={code} href={url}>
                  <SplitString text={name} split={40} />
                </Link>
              </Text>
              <Text style={{ ...compactText, ...code }}>
                <SplitString text={message} split={63} />
              </Text>
            </Section>

            <Section style={{ padding: `${unit * 1.5}px 0 0 0` }}>
              <Text style={sectionLabel}>STACK TRACE</Text>
            </Section>
            <Section style={stacktraceContainer}>
              {!stacktrace && (
                <Row>
                  <Column>
                    <Text style={{ ...stacktraceFrame, ...compactText }}>
                      No stacktrace available
                    </Text>
                  </Column>
                </Row>
              )}
              {stacktrace &&
                stacktrace.map((frame, index) => (
                  <>
                    {frame.raw ? (
                      <Row key={index}>
                        <Column>
                          <span style={stacktraceFrame}>
                            <FormattedCode text={frame.raw} split={65} />
                          </span>
                        </Column>
                      </Row>
                    ) : (
                      <Row key={index}>
                        <Column>
                          <span
                            style={
                              frame.important
                                ? stacktraceFrameFileImportant
                                : stacktraceFrame
                            }
                          >
                            <SplitString text={frame.file || ""} split={65} />
                          </span>
                          &nbsp;&nbsp;
                          <span
                            style={
                              frame.important
                                ? stacktraceFramePositionImportant
                                : stacktraceFrame
                            }
                          >
                            {frame.line}
                          </span>
                          <span style={stacktraceFrame}>:</span>
                          <span
                            style={
                              frame.important
                                ? stacktraceFramePositionImportant
                                : stacktraceFrame
                            }
                          >
                            {frame.column}
                          </span>
                        </Column>
                      </Row>
                    )}
                    {index < stacktrace.length - 1 && (
                      <Row>
                        <Column>
                          <SurfaceHr />
                        </Column>
                      </Row>
                    )}
                    {frame.context &&
                      renderStacktraceFrameContext(frame.context)}
                  </>
                ))}
            </Section>

            <Row style={headingHr}>
              <Column>
                <Hr />
              </Column>
            </Row>

            <Row>
              <Column>
                <Link href="https://console.sst.dev" style={footerLink}>
                  View Console
                </Link>
              </Column>
              <Column align="right">
                <Link href={settingsUrl} style={footerLink}>
                  Manage Settings
                </Link>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default IssueEmail;
