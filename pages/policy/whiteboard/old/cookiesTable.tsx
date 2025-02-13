interface ICookieRow {
  cookie: string;
  names: string;
  purpose: string;
  type: string;
  link?: { url?: string; text?: string };
}

interface ICookiesTable {
  rows: ICookieRow[];
}

export const CookiesTable = ({ rows }: ICookiesTable) => {
  return (
    <div className="tableWrapper">
      <table className="standard-table">
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Name(s)</th>
            <th>Purpose</th>
            <th>Type of cookie</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row: ICookieRow, index: number) => (
            <tr key={index}>
              <td>{row.cookie}</td>
              <td>{row.names}</td>
              <td>
                {row.purpose}
                {row.link && (
                  <>
                    <br />
                    <a href={row.link.url} target="_blank" rel="noopener noreferrer">
                      {row.link.text}
                    </a>
                  </>
                )}
              </td>
              <td>{row.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CookiesTable;
