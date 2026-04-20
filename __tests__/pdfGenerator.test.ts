import { generateCVHtml } from '../utils/pdfGenerator';
import { CVData } from '../types/cv.types';

// 🟢 4. El sistema agrupa las pruebas relacionadas con la generación del documento PDF.
describe('Generador de HTML para PDF', () => {
  
  // 🟢 5. El sistema define el objetivo específico de la prueba: validar la existencia de las secciones.
  it('debe contener las secciones esperadas del CV', () => {
    
    // 🟢 6. Se construyen datos ficticios para simular la información de un usuario.
    const mockData: CVData = {
      personalInfo: {
        fullName: "Usuario Prueba",
        email: "prueba@email.com",
        phone: "099999999",
        location: "Quito",
        summary: "Resumen de prueba"
      },
      experiences: [],
      education: [],
      skills: []
    };

    // 🟢 7. Se ejecuta la función principal utilizando los datos ficticios.
    const resultHtml = generateCVHtml(mockData);

    // 🟢 8. El sistema evalúa el texto resultante y exige que contenga los títulos obligatorios.
    expect(resultHtml).toContain('Resumen Profesional');
    expect(resultHtml).toContain('Experiencia Laboral');
    expect(resultHtml).toContain('Educación');
    expect(resultHtml).toContain('Habilidades Técnicas');
  });

});