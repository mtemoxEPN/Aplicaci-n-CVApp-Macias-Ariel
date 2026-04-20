import { CVData } from '../types/cv.types';

// 🟢 1. Se exporta la función para que pueda ser utilizada tanto por la pantalla visual como por el archivo de pruebas.
export const generateCVHtml = (cvData: CVData) => {
    const { personalInfo, experiences, education, skills } = cvData;

    return `
        <html>
            <head>
                <style>
                    body { font-family: 'Helvetica', sans-serif; padding: 20px; color: #333; }
                    .header { border-bottom: 2px solid #C41E3A; padding-bottom: 10px; margin-bottom: 20px; }
                    .name { font-size: 28px; font-weight: bold; color: #000; margin: 0; }
                    .section-title { color: #C41E3A; font-size: 18px; font-weight: bold; margin-top: 20px; text-transform: uppercase; }
                    .item { margin-bottom: 15px; }
                    .item-title { font-weight: bold; font-size: 14px; }
                    .item-date { color: #666; font-size: 12px; }
                    .skill-list { display: flex; flex-wrap: wrap; gap: 10px; }
                    .skill-item { background: #f0f0f0; padding: 5px 10px; border-radius: 15px; font-size: 12px; border: 1px solid #ccc; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1 class="name">${personalInfo.fullName || 'Sin Nombre'}</h1>
                    <p>${personalInfo.email} | ${personalInfo.phone}</p>
                    <p>${personalInfo.location}</p>
                </div>

                <div class="section-title">Resumen Profesional</div>
                <p>${personalInfo.summary || 'Sin resumen disponible.'}</p>

                <div class="section-title">Experiencia Laboral</div>
                ${experiences.map(exp => `
                    <div class="item">
                        <div class="item-title">${exp.position} - ${exp.company}</div>
                        <div class="item-date">${exp.startDate} - ${exp.endDate || 'Actual'}</div>
                        <p>${exp.description || ''}</p>
                    </div>
                `).join('')}

                <div class="section-title">Educación</div>
                ${education.map(edu => `
                    <div class="item">
                        <div class="item-title">${edu.degree} en ${edu.field}</div>
                        <div class="item-date">${edu.institution} (${edu.graduationYear})</div>
                    </div>
                `).join('')}

                <div class="section-title">Habilidades Técnicas</div>
                <div class="skill-list">
                    ${skills.map(skill => `<span class="skill-item">${skill.name} (${skill.level})</span>`).join('')}
                </div>
            </body>
        </html>
    `;
};