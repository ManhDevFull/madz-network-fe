"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import styled from "styled-components";

type InputSendProps = {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  isSending?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void | Promise<void>;
  onFileSelect?: (file: File | null) => void;
};

export default function InputSend({
  value,
  defaultValue = "",
  placeholder = "Message...",
  disabled = false,
  isSending = false,
  className,
  onChange,
  onSubmit,
  onFileSelect,
}: InputSendProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const message = isControlled ? value : internalValue;
  const trimmedMessage = useMemo(() => message.trim(), [message]);
  const isSubmitDisabled = disabled || isSending || trimmedMessage.length === 0;

  function updateValue(nextValue: string) {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    await onSubmit?.(trimmedMessage);

    if (!isControlled) {
      setInternalValue("");
    }

    onChange?.("");
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    onFileSelect?.(file);
    event.target.value = "";
  }

  return (
    <StyledWrapper className={className}>
      <form className="messageBox" onSubmit={(event) => void handleSubmit(event)}>
        <div className="fileUploadWrapper">
          <label htmlFor="chat-file-input">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 337 337">
              <circle
                strokeWidth={20}
                stroke="#6c6c6c"
                fill="none"
                r="158.5"
                cy="168.5"
                cx="168.5"
              />
              <path strokeLinecap="round" strokeWidth={25} stroke="#6c6c6c" d="M167.759 79V259" />
              <path strokeLinecap="round" strokeWidth={25} stroke="#6c6c6c" d="M79 167.138H259" />
            </svg>
            <span className="tooltip">Add an image</span>
          </label>
          <input
            type="file"
            id="chat-file-input"
            name="file"
            onChange={handleFileChange}
            disabled={disabled || isSending}
          />
        </div>
        <input
          required
          placeholder={placeholder}
          type="text"
          id="messageInput"
          value={message}
          disabled={disabled || isSending}
          onChange={(event) => updateValue(event.target.value)}
        />
        <button id="sendButton" type="submit" disabled={isSubmitDisabled}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 664 663">
            <path fill="none" d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888" />
            <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="33.67" stroke="#6c6c6c" d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888" />
          </svg>
        </button>
      </form>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  width: 100%;

  .messageBox {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2d2d2d;
    padding: 0 15px;
    border-radius: 10px;
    border: 1px solid rgb(63, 63, 63);
  }

  .messageBox:focus-within {
    border: 1px solid rgb(110, 110, 110);
  }

  .fileUploadWrapper {
    width: fit-content;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Arial, Helvetica, sans-serif;
  }

  #chat-file-input {
    display: none;
  }

  .fileUploadWrapper label {
    cursor: pointer;
    width: fit-content;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .fileUploadWrapper label svg {
    height: 18px;
  }

  .fileUploadWrapper label svg path {
    transition: all 0.3s;
  }

  .fileUploadWrapper label svg circle {
    transition: all 0.3s;
  }

  .fileUploadWrapper label:hover svg path {
    stroke: #fff;
  }

  .fileUploadWrapper label:hover svg circle {
    stroke: #fff;
    fill: #3c3c3c;
  }

  .fileUploadWrapper label:hover .tooltip {
    display: block;
    opacity: 1;
  }

  .tooltip {
    position: absolute;
    top: -40px;
    display: none;
    opacity: 0;
    color: white;
    font-size: 10px;
    text-wrap: nowrap;
    background-color: #000;
    padding: 6px 10px;
    border: 1px solid #3c3c3c;
    border-radius: 5px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.596);
    transition: all 0.3s;
  }

  #messageInput {
    width: 100%;
    height: 100%;
    background-color: transparent;
    outline: none;
    border: none;
    padding-left: 10px;
    color: white;
  }

  #messageInput:focus ~ #sendButton svg path,
  #messageInput:valid ~ #sendButton svg path {
    fill: #3c3c3c;
    stroke: white;
  }

  #sendButton {
    width: fit-content;
    height: 100%;
    background-color: transparent;
    outline: none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
  }

  #sendButton svg {
    height: 18px;
    transition: all 0.3s;
  }

  #sendButton svg path {
    transition: all 0.3s;
  }

  #sendButton:hover svg path {
    fill: #3c3c3c;
    stroke: white;
  }

  #sendButton:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  #sendButton:disabled svg path {
    fill: none;
    stroke: #6c6c6c;
  }
`;
