'use client';

import { useChat } from '@ai-sdk/react';


// Simple Spinner component
const Spinner = () => (
  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" 
       role="status">
    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
      Loading...
    </span>
  </div>
);



export default function Page() {
  const { messages, input, handleInputChange, handleSubmit, status, stop, addToolResult } = useChat({
    maxSteps: 5,
    // run client-side tools that are automatically executed:
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === 'getLocation') {
        const cities = [
          'New York',
          'Los Angeles',
          'Chicago',
          'San Francisco',
        ];
        return cities[Math.floor(Math.random() * cities.length)];
      }
    },
  });
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow py-4">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-xl font-semibold text-gray-800">Chat System</h1>
        </div>
      </header>
      
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 h-[60vh] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              <p>No messages yet. Start a conversation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-blue-100 ml-12 text-blue-900' 
                      : 'bg-gray-100 mr-12 text-gray-900'
                  }`}
                >
                  <div className="font-semibold mb-1">
                    {message.role === 'user' ? 'You' : 'AI Assistant'}
                  </div>
                  {message.content ? (
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  ) : (
                    <div>
                      {message.parts?.map((part, index) => {
                        switch (part.type) {
                          // render text parts as simple text:
                          case 'text':
                            return <div key={index} className="whitespace-pre-wrap">{part.text}</div>;

                          // for tool invocations, distinguish between the tools and the state:
                          case 'tool-invocation': {
                            const callId = part.toolInvocation.toolCallId;

                            switch (part.toolInvocation.toolName) {
                              case 'askForConfirmation': {
                                switch (part.toolInvocation.state) {
                                  case 'call':
                                    return (
                                      <div key={callId} className="mt-2 p-2 border border-gray-200 rounded-md">
                                        <p className="mb-2">{part.toolInvocation.args.message}</p>
                                        <div className="flex space-x-2">
                                          <button
                                            onClick={() =>
                                              addToolResult({
                                                toolCallId: callId,
                                                result: 'Yes, confirmed.',
                                              })
                                            }
                                            className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                                          >
                                            Yes
                                          </button>
                                          <button
                                            onClick={() =>
                                              addToolResult({
                                                toolCallId: callId,
                                                result: 'No, denied',
                                              })
                                            }
                                            className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                                          >
                                            No
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  case 'result':
                                    return (
                                      <div key={callId} className="mt-2 text-gray-600 italic">
                                        Confirmation: {part.toolInvocation.result}
                                      </div>
                                    );
                                }
                                break;
                              }

                              case 'getLocation': {
                                switch (part.toolInvocation.state) {
                                  case 'call':
                                    return <div key={callId} className="mt-2 text-gray-600 italic">Getting location...</div>;
                                  case 'result':
                                    return (
                                      <div key={callId} className="mt-2 text-gray-600 italic">
                                        Location: {part.toolInvocation.result}
                                      </div>
                                    );
                                }
                                break;
                              }

                              case 'getWeatherInformation': {
                                switch (part.toolInvocation.state) {
                                  case 'partial-call':
                                    return (
                                      <div key={callId} className="mt-2 text-gray-600 italic">
                                        Fetching weather information...
                                      </div>
                                    );
                                  case 'call':
                                    return (
                                      <div key={callId} className="mt-2 text-gray-600 italic">
                                        Getting weather for {part.toolInvocation.args.city}...
                                      </div>
                                    );
                                  case 'result':
                                    return (
                                      <div key={callId} className="mt-2 p-2 bg-blue-50 rounded-md">
                                        <p className="font-medium">Weather in {part.toolInvocation.args.city}:</p>
                                        <p>{part.toolInvocation.result}</p>
                                      </div>
                                    );
                                }
                                break;
                              }
                            }
                          }
                        }
                      })}
                    </div>
                  )}
                </div>
              ))}
              {(status === 'submitted' || status === 'streaming') && (
                <div className="p-3 bg-gray-50 rounded-lg flex items-center">
                  {status === 'submitted' && (
                    <div className="flex items-center space-x-2">
                      <Spinner />
                      <span className="text-gray-600">AI is preparing a response...</span>
                    </div>
                  )}
                  {status === 'streaming' && (
                    <div className="text-gray-600">AI is responding...</div>
                  )}
                  <button 
                    type="button" 
                    onClick={() => stop()}
                    className="ml-auto px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm font-medium transition-colors"
                  >
                    Stop Response
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input 
            name="prompt" 
            value={input} 
            onChange={handleInputChange}
            disabled={false}
            placeholder="Type your message here..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
}