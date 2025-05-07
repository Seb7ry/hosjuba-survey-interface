import { Link } from 'react-router-dom';

const TemplateCard = ({ template }: { template: { id: number, name: string, date: string } }) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
      <h3>{template.name}</h3>
      <p>{template.date}</p>
      <div>
        <Link to={`/templates/edit/${template.id}`}>
          <button>Editar</button>
        </Link>
        <Link to={`/templates/preview/${template.id}`}>
          <button>Ver</button>
        </Link>
      </div>
    </div>
  );
};

export default TemplateCard;
