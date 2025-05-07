import { useState, useEffect } from "react";
import { PDFDocument, rgb } from "pdf-lib"; // Usamos pdf-lib para manipular el PDF
import { listTemplates, downloadFile } from "../services/one-drive.service"; // Asumiendo que las funciones están en un servicio separado

const Templates = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [formFields, setFormFields] = useState<{ x: number; y: number; label: string }[]>([]); // Campos de texto a agregar
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null); // Plantilla seleccionada

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await listTemplates(); // Obtener plantillas desde OneDrive
        setTemplates(data);
      } catch (error) {
        console.error("Error al cargar las plantillas:", error);
      }
    };
    fetchTemplates();
  }, []);

  const handleTemplateSelect = async (templateId: string) => {
    try {
      const fileBlob = await downloadFile(templateId); // Descargar el archivo PDF desde OneDrive
      const fileUrl = URL.createObjectURL(fileBlob);
      setSelectedTemplate(templateId);
      setFileUrl(fileUrl); // Mostrar el PDF descargado
    } catch (error) {
      console.error("Error al descargar la plantilla:", error);
    }
  };

  const handleAddField = (x: number, y: number) => {
    // Agregar un campo en la ubicación (x, y)
    setFormFields([...formFields, { x, y, label: "Nuevo Campo" }]);
  };

  const handleGeneratePdf = async () => {
    if (fileUrl) {
      const existingPdfBytes = await fetch(fileUrl).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // Crear un campo de texto en el PDF
      const form = pdfDoc.getForm();
      formFields.forEach(field => {
        const textField = form.createTextField(field.label);
        textField.setText("Texto aquí");
        textField.addToPage(pdfDoc.getPages()[0], { x: field.x, y: field.y });

      });

      // Generar el nuevo PDF
      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(pdfBlob);
      setFileUrl(url); // Mostrar el PDF generado
    }
  };

  return (
    <div>
      <h1>Seleccionar Plantilla</h1>
      <div>
        {templates.length > 0 ? (
          templates.map((template: any) => (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template.id)}
              className="p-2 bg-blue-600 text-white rounded-lg mb-2"
            >
              {template.name}
            </button>
          ))
        ) : (
          <p>No se encontraron plantillas.</p>
        )}
      </div>

      {fileUrl && (
        <div>
          {/* Mostrar PDF seleccionado */}
          <embed src={fileUrl} width="600" height="400" type="application/pdf" />

          {/* Agregar un campo de formulario sobre el PDF */}
          <button onClick={() => handleAddField(100, 200)} className="mt-4 bg-blue-600 text-white p-2 rounded-lg">
            Agregar Campo
          </button>

          {/* Botón para generar el PDF final */}
          <button onClick={handleGeneratePdf} className="mt-4 bg-green-600 text-white p-2 rounded-lg">
            Generar PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default Templates;
