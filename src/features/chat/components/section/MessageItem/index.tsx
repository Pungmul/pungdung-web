"use client";

import React from "react";

import { areMessageItemPropsEqual } from "./message-item.memo";
import { MessageItemComponent } from "./MessageItem";

export const MessageItem = React.memo(MessageItemComponent, areMessageItemPropsEqual);
