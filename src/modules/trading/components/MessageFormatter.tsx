import React from 'react';

function JsonTable({ data }: { data: any }) {
  if (Array.isArray(data)) {
    if (data.length === 0) return <div className="text-muted-foreground italic text-xs">Dữ liệu rỗng</div>;
    // Assuming array of objects
    const isObjectArray = typeof data[0] === 'object' && data[0] !== null;
    
    if (isObjectArray) {
      const keys = Array.from(new Set(data.flatMap(item => Object.keys(item))));
      return (
        <div className="overflow-x-auto my-2 rounded-lg border border-border">
          <table className="min-w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-muted/80">
                {keys.map((k) => (
                  <th key={String(k)} className="border-b border-r border-border p-2 font-semibold last:border-r-0 whitespace-nowrap">{String(k)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  {keys.map((k) => (
                    <td key={String(k)} className="border-b border-r border-border p-2 last:border-r-0 max-w-[200px] truncate" title={typeof row[k] === 'object' ? JSON.stringify(row[k]) : String(row[k])}>
                      {typeof row[k] === 'object' ? JSON.stringify(row[k]) : String(row[k])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      // Array of strings/numbers
      return (
        <div className="flex flex-wrap gap-1 my-2">
          {data.map((item, idx) => (
            <span key={idx} className="bg-muted px-2 py-1 rounded-md text-xs border border-border">
              {String(item)}
            </span>
          ))}
        </div>
      );
    }
  }

  // Object
  if (typeof data === 'object' && data !== null) {
    return (
      <div className="overflow-x-auto my-2 rounded-lg border border-border">
        <table className="min-w-full text-xs text-left border-collapse">
          <tbody>
            {Object.entries(data).map(([key, value], idx, arr) => (
              <tr key={key} className={idx === arr.length - 1 ? '' : 'border-b border-border'}>
                <td className="p-2 font-semibold bg-muted/50 border-r border-border w-1/3 break-all">{key}</td>
                <td className="p-2 break-words">
                  {typeof value === 'object' ? (
                    <pre className="text-[10px] overflow-x-auto whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
                  ) : (
                    String(value)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <span>{String(data)}</span>;
}

export const MessageFormatter: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return null;

  // 1. Thay thế các dấu Markdown đơn giản
  // **bold**
  let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // *italic* hoặc list item (nếu nó là gạch đầu dòng thì xóa đi)
  // Xóa gạch đầu dòng * nếu nó đứng đầu hàng
  formatted = formatted.replace(/^\s*\*\s+/gm, '• ');
  // Các dấu * còn lại có thể là in nghiêng
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // 2. Chặn các khối code JSON
  // AI có thể trả về: ```json ... ```
  const codeBlockRegex = /```(?:json)?\n?([\s\S]*?)```/g;
  const parts = formatted.split(codeBlockRegex);

  return (
    <div className="space-y-1">
      {parts.map((part, index) => {
        // Phần ngoài khối code
        if (index % 2 === 0) {
          if (!part.trim()) return null;
          // Tự động detect JSON string (raw) nếu như AI quên bọc ```json
          // Bắt các chuỗi dạng { "key": "value" }
          const quickJsonMatch = part.match(/(\{[\s\S]*"[\s\S]*\})/);
          if (quickJsonMatch && quickJsonMatch[1].includes('"')) {
            try {
              const parsed = JSON.parse(quickJsonMatch[1]);
              const before = part.substring(0, quickJsonMatch.index);
              const after = part.substring((quickJsonMatch.index || 0) + quickJsonMatch[1].length);
              return (
                <React.Fragment key={index}>
                  {before && <span dangerouslySetInnerHTML={{ __html: before.replace(/\n/g, '<br />') }} />}
                  <JsonTable data={parsed} />
                  {after && <span dangerouslySetInnerHTML={{ __html: after.replace(/\n/g, '<br />') }} />}
                </React.Fragment>
              );
            } catch {
              // Bỏ qua nếu không parse được
            }
          }

          return (
            <div 
              key={index} 
              dangerouslySetInnerHTML={{ __html: part.replace(/\n/g, '<br />') }} 
            />
          );
        }

        // Khối code (index % 2 === 1)
        try {
          // Thử Parse khối code thành JSON
          const jsonObj = JSON.parse(part.trim());
          return <JsonTable key={index} data={jsonObj} />;
        } catch (e) {
          // Không phải JSON hợp lệ -> hiển thị code box
          return (
            <pre key={index} className="bg-background/80 text-foreground p-3 rounded-xl overflow-x-auto text-xs font-mono my-2 border border-border">
              {part}
            </pre>
          );
        }
      })}
    </div>
  );
};
