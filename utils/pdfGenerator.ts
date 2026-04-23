import { CVData } from '../types/cv.types';

export const generateCVHtml = (cvData: CVData) => {
    const { personalInfo, experiences, education, skills } = cvData;

    // 🟢 1. Generamos el bloque de la imagen solo si el usuario seleccionó una foto
    const profileImageHtml = personalInfo.profileImage 
        ? `<img src="${personalInfo.profileImage}" class="profile-img" />` 
        : '';

    return `
        <html>
            <head>
                <style>
                    body { font-family: 'Helvetica', sans-serif; padding: 20px; color: #333; }
                    
                    /* 🟢 2. Cambiamos el header para que la foto y el texto se alineen horizontalmente */
                    .header { 
                        display: flex; 
                        align-items: center; 
                        border-bottom: 2px solid #C41E3A; 
                        padding-bottom: 20px; 
                        margin-bottom: 20px; 
                    }
                    
                    /* 🟢 3. Estilos redondos para la foto del PDF */
                    .profile-img {
                        width: 100px;
                        height: 100px;
                        border-radius: 50%;
                        object-fit: cover;
                        margin-right: 20px;
                        border: 3px solid #C41E3A;
                    }
                    
                    .header-info { flex: 1; }
                    .name { font-size: 28px; font-weight: bold; color: #000; margin: 0 0 8px 0; }
                    .contact-text { margin: 0 0 4px 0; color: #555; font-size: 14px; }
                    
                    .section-title { color: #C41E3A; font-size: 18px; font-weight: bold; margin-top: 20px; margin-bottom: 10px; text-transform: uppercase; }
                    .item { margin-bottom: 15px; }
                    .item-title { font-weight: bold; font-size: 14px; }
                    .item-date { color: #666; font-size: 12px; }
                    .skill-list { display: flex; flex-wrap: wrap; gap: 10px; }
                    .skill-item { background: #f0f0f0; padding: 5px 10px; border-radius: 15px; font-size: 12px; border: 1px solid #ccc; }
                </style>
            </head>
            <body>
                <div class="header">
                    ${profileImageHtml}
                    <div class="header-info">
                        <h1 class="name">${personalInfo.fullName || 'Sin Nombre'}</h1>
                        <p class="contact-text">✉ ${personalInfo.email} | ☎ ${personalInfo.phone}</p>
                        <p class="contact-text">📍 ${personalInfo.location}</p>
                    </div>
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