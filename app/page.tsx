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
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-800">Chat System</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </button>
          </div>
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
                        if (part.type === 'text') {
                          return <div key={index} className="whitespace-pre-wrap">{part.text}</div>;
                        }
                        
                        if (part.type === 'tool-invocation') {
                          switch (part.toolInvocation.state) {
                            case 'partial-call':
                              return (
                                <div key={index} className="mt-2 p-2 bg-yellow-50 rounded-md">
                                  <p className="text-yellow-700">
                                    <span className="font-medium">Tool: </span>
                                    {part.toolInvocation.toolName} (processing...)
                                  </p>
                                  <pre className="text-xs mt-1 text-gray-500 overflow-x-auto">
                                    {JSON.stringify(part.toolInvocation.args, null, 2)}
                                  </pre>
                                </div>
                              );
                            case 'call':
                              return (
                                <div key={index} className="mt-2 p-2 bg-blue-50 rounded-md">
                                  <p className="text-blue-700">
                                    <span className="font-medium">Tool: </span>
                                    {part.toolInvocation.toolName}
                                  </p>
                                  {part.toolInvocation.toolName === 'askForConfirmation' && (
                                    <div className="mt-2">
                                      <p className="mb-2">{part.toolInvocation.args.message}</p>
                                      <div className="flex space-x-2">
                                        <button
                                          onClick={() =>
                                            addToolResult({
                                              toolCallId: part.toolInvocation.toolCallId,
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
                                              toolCallId: part.toolInvocation.toolCallId,
                                              result: 'No, denied',
                                            })
                                          }
                                          className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                                        >
                                          No
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                  {part.toolInvocation.toolName !== 'askForConfirmation' && (
                                    <pre className="text-xs mt-1 text-gray-500 overflow-x-auto">
                                      {JSON.stringify(part.toolInvocation.args, null, 2)}
                                    </pre>
                                  )}
                                </div>
                              );
                            case 'result':
                              return (
                                <div key={index} className="mt-2 p-2 bg-green-50 rounded-md">
                                  <p className="text-green-700">
                                    <span className="font-medium">Result from {part.toolInvocation.toolName}: </span>
                                  </p>
                                  <div className="mt-1">
                                    {typeof part.toolInvocation.result === 'string' ? (
                                      <p>{part.toolInvocation.result}</p>
                                    ) : (
                                      <pre className="text-xs text-gray-700 overflow-x-auto">
                                        {JSON.stringify(part.toolInvocation.result, null, 2)}
                                      </pre>
                                    )}
                                  </div>
                                </div>
                              );
                            default:
                              return null;
                          }
                        }
                        
                        return null;
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
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>Chat System &copy; {new Date().getFullYear()} | Built with Next.js and AI SDK</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="#" className="hover:text-gray-700 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Help</a>
            <a href="#" className="hover:text-gray-700 transition-colors">About</a>
          </div>
        </div>
      </footer>
    </div>
  );
}