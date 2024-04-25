import React, { useState } from 'react';
import Editor from "@monaco-editor/react";
import 'bulma/css/bulma.min.css';

function EditorPage() {
    const code = 'console.log("Hello, world!");';
    const [editorCode, setEditorCode] = useState<string>(code);
    const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
    const [expectedOutput, setExpectedOutput] = useState<string>('Expected: ');
    const [resultMessage, setResultMessage] = useState<string>('Result: ');
    const [submissionStatus, setSubmissionStatus] = useState<string>('');

    // Mock question data (replace with actual data)
    const question = {
        title: 'Two Sum',
        description: 'Given an array of integers, return indices of the two numbers such that they add up to a specific target.'
    };

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            setEditorCode(value);
        }
    };

    const runCode = () => {
        const originalConsoleLog = console.log;
        const logMessages: string[] = [];
        console.log = (...args: any[]) => {
            logMessages.push(args.join(' '));
            originalConsoleLog(...args);
        };

        try {
            const result = new Function(editorCode)();
            const expected = 42; // Example expected result
            setExpectedOutput(`Expected: ${expected}`);
            setResultMessage(`Result: ${result}`);
            if (result === expected) {
                setSubmissionStatus('Accepted');
            } else {
                setSubmissionStatus('Denied');
            }
        } catch (error) {
            if (error instanceof Error) {
                logMessages.push(`Error: ${error.message}`);
            } else {
                logMessages.push('An unexpected error occurred');
            }
            setExpectedOutput('Expected: ');
            setResultMessage('Result: ');
            setSubmissionStatus('');
        }

        console.log = originalConsoleLog;
        setConsoleOutput(logMessages);
    };

    const handleSubmit = () => {
        if (submissionStatus === 'Accepted') {
            // Perform API call to submit the solution to the database
            console.log('Submitting solution to the database');
        } else {
            console.log('Solution not accepted, cannot submit');
        }
    };

    return (
        <div className="container is-fluid">
            <div className="columns" style={{ height: '50vh', marginTop: '20px' }}>
                <div className="column is-half">
                    <div className="box" style={{ height: '50vh', overflowY: 'auto' }}>
                        <h2 className="title is-4">{question.title}</h2>
                        <p>{question.description}</p>
                    </div>
                </div>
                <div className="column is-half">
                    <div className="editor">
                        <Editor
                            height="50vh"
                            defaultLanguage="javascript"
                            defaultValue={editorCode}
                            onChange={handleEditorChange}
                            theme="vs-dark"
                        />
                    </div>
                </div>
            </div>
            <div className="columns">
                <div className="column is-full">
                    <div className="box" style={{ overflowY: 'auto', height: '25vh' }}>
                        <button className="button is-info" onClick={runCode}>Run Tests</button>
                        <p>{expectedOutput}</p>
                        <p>{resultMessage}</p>
                        <p>{submissionStatus}</p>
                        <button className="button is-primary" onClick={handleSubmit} disabled={submissionStatus !== 'Accepted'}>Submit</button>
                        <p>Console Output:</p>
                        {consoleOutput.map((output, index) => <p key={index}>{output}</p>)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditorPage;
