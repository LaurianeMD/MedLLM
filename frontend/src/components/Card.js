export const Card = ({ children }) => (
    <div className="card bg-gray-800 p-4 rounded-lg shadow-lg">
      {children}
    </div>
  );
  
  export const CardContent = ({ children }) => (
    <div className="card-content text-white">{children}</div>
  );
  
  export const CardHeader = ({ children }) => (
    <div className="card-header text-lg font-bold">{children}</div>
  );
  
  export const CardTitle = ({ children }) => (
    <h2 className="card-title text-xl">{children}</h2>
  );
  