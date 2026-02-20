import React, { useState, useCallback, type ReactNode } from "react";
import { LoggerContext, levelPriority } from "./LoggerContext";
import { LogLevel } from "../enums";

export const LoggerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentLevel, setCurrentLevel] = useState<LogLevel>(LogLevel.INFO);

  const setLogLevel = useCallback((level: LogLevel) => {
    setCurrentLevel(level);
  }, []);

  const log = useCallback(
    (level: LogLevel, message: string, ...args: unknown[]) => {
      if (levelPriority[level] >= levelPriority[currentLevel]) {
        switch (level) {
          case LogLevel.DEBUG:
            console.debug(message, ...args);
            break;
          case LogLevel.INFO:
            console.info(message, ...args);
            break;
          case LogLevel.WARN:
            console.warn(message, ...args);
            break;
          case LogLevel.ERROR:
            console.error(message, ...args);
            break;
          default:
            console.log(message, ...args);
        }
      }
    },
    [currentLevel],
  );

  return (
    <LoggerContext.Provider value={{ setLogLevel, log }}>
      {children}
    </LoggerContext.Provider>
  );
};
