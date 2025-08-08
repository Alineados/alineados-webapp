import jsPDF from 'jspdf';

interface ExportItem {
    description: string;
    prominent: boolean;
    daily: boolean;
}

interface CategoryInfo {
    cid: string;
    uid: string;
    is_current: boolean;
    elements: ExportItem[];
    objectives: ExportItem[];
    positive_actions: ExportItem[];
    improve_actions: ExportItem[];
    habits: ExportItem[];
    short_actions: ExportItem[];
    middle_actions: ExportItem[];
    long_actions: ExportItem[];
}

interface PillarExportData {
    categoryName: string;
    categoryInfo: CategoryInfo;
    pillarType: string;
    categoryData?: {
        priority?: number;
        state?: number;
        active?: boolean;
    };
}

interface AllCategoriesExportData {
    categories: PillarExportData[];
    pillarType: string;
}

// Función para verificar si una categoría tiene contenido
function hasCategoryContent(categoryInfo: CategoryInfo): boolean {
    const sections = [
        categoryInfo.elements,
        categoryInfo.objectives,
        categoryInfo.positive_actions,
        categoryInfo.improve_actions,
        categoryInfo.habits,
        categoryInfo.short_actions,
        categoryInfo.middle_actions,
        categoryInfo.long_actions
    ];
    
    return sections.some(section => section && section.length > 0);
}

// Función para obtener el texto de prioridad con caracteres ASCII
function getPriorityText(priority?: number): string {
    if (priority === undefined) return '';
    
    const priorityMap: { [key: number]: string } = {
        1: '(*) Baja',
        2: '(**) Media', 
        3: '(***) Alta'
    };
    
    return `${priorityMap[priority] || '(?)'} - ${priority}`;
}

// Función para obtener el texto de estado con caracteres ASCII
function getStateText(state?: number): string {
    if (state === undefined) return '';
    
    const stateMap: { [key: number]: string } = {
        1: ':( Triste',
        2: ':| Neutral',
        3: ':) Feliz'
    };
    
    return `${stateMap[state] || '(?)'} - ${state}`;
}

export function exportPillarToPDF(data: PillarExportData) {
    const { categoryName, categoryInfo, pillarType, categoryData } = data;
    
    // Crear nuevo documento PDF
    const doc = new jsPDF();
    
    // Configuración de fuentes y tamaños
    const titleFontSize = 20;
    const sectionFontSize = 14;
    const itemFontSize = 10;
    const lineHeight = 7;
    
    let yPosition = 20;
    const margin = 20;
    const maxWidth = doc.internal.pageSize.width - (margin * 2);
    
    // Función para agregar texto con wrap
    function addWrappedText(text: string, fontSize: number, y: number, maxWidth: number): number {
        doc.setFontSize(fontSize);
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, margin, y);
        return y + (lines.length * lineHeight);
    }
    
    // Función para agregar items con bullets
    function addItemsWithBullets(items: ExportItem[], sectionTitle: string, startY: number): number {
        if (!items || items.length === 0) return startY;
        
        let currentY = startY;
        
        // Agregar título de sección
        currentY = addWrappedText(sectionTitle, sectionFontSize, currentY, maxWidth) + 5;
        
        // Agregar items
        items.forEach((item, index) => {
            if (currentY > doc.internal.pageSize.height - 30) {
                doc.addPage();
                currentY = 20;
            }
            
            doc.setFontSize(itemFontSize);
            const itemText = `• ${item.description}`;
            const lines = doc.splitTextToSize(itemText, maxWidth - 10);
            
            doc.text(lines, margin + 10, currentY);
            currentY += lines.length * lineHeight + 2;
        });
        
        return currentY + 10;
    }
    
    // Título principal
    yPosition = addWrappedText(categoryName.toUpperCase(), titleFontSize, yPosition, maxWidth) + 10;
    
    // Verificar si la categoría está vacía
    const hasContent = hasCategoryContent(categoryInfo);
    const isActive = categoryData?.active ?? false;
    
    // Información de estado de la categoría
    if (!hasContent) {
        // Categoría vacía
        yPosition = addWrappedText('(!) CATEGORÍA INACTIVA - SIN DATOS', sectionFontSize, yPosition, maxWidth) + 5;
        yPosition = addWrappedText('Esta categoría no contiene información. Agrega elementos para activarla.', itemFontSize, yPosition, maxWidth) + 10;
    } else {
        // Solo mostrar información de pilar, importancia y estado si hay contenido
        
        // Información de la categoría
        const pillarTypeText = pillarType.charAt(0).toUpperCase() + pillarType.slice(1);
        yPosition = addWrappedText(`Pilar: ${pillarTypeText}`, sectionFontSize, yPosition, maxWidth) + 5;
        
        // Información de importancia y estado
        if (categoryData) {
            if (categoryData.priority !== undefined) {
                const priorityText = `Importancia: ${getPriorityText(categoryData.priority)}`;
                yPosition = addWrappedText(priorityText, itemFontSize, yPosition, maxWidth) + 3;
            }
            
            if (categoryData.state !== undefined) {
                const stateText = `Estado: ${getStateText(categoryData.state)}`;
                yPosition = addWrappedText(stateText, itemFontSize, yPosition, maxWidth) + 5;
            }
        }
        
        // Información adicional si la categoría está inactiva
        if (!isActive) {
            yPosition = addWrappedText('(!) CATEGORÍA INACTIVA', sectionFontSize, yPosition, maxWidth) + 5;
            yPosition = addWrappedText('Esta categoría contiene información pero está marcada como inactiva.', itemFontSize, yPosition, maxWidth) + 10;
        }
    }
    
    // Solo mostrar secciones si hay contenido
    if (hasContent) {
        // Secciones
        const sections = [
            { title: 'Elementos', items: categoryInfo.elements },
            { title: 'Objetivos', items: categoryInfo.objectives },
            { title: 'Acciones Pasadas - Positivas', items: categoryInfo.positive_actions },
            { title: 'Acciones Pasadas - Por Mejorar', items: categoryInfo.improve_actions },
            { title: 'Hábitos', items: categoryInfo.habits },
            { title: 'Acciones Futuras - Corto Plazo', items: categoryInfo.short_actions },
            { title: 'Acciones Futuras - Mediano Plazo', items: categoryInfo.middle_actions },
            { title: 'Acciones Futuras - Largo Plazo', items: categoryInfo.long_actions }
        ];
        
        sections.forEach(section => {
            yPosition = addItemsWithBullets(section.items, section.title, yPosition);
        });
    }
    
    // Guardar el PDF
    const fileName = `${categoryName.replace(/\s+/g, '_')}_${pillarType}.pdf`;
    doc.save(fileName);
}

export function exportAllCategoriesToPDF(data: AllCategoriesExportData) {
    const { categories, pillarType } = data;
    
    // Crear nuevo documento PDF
    const doc = new jsPDF();
    
    // Configuración de fuentes y tamaños mejorados
    const titleFontSize = 24;
    const categoryTitleFontSize = 18;
    const sectionFontSize = 14;
    const itemFontSize = 11;
    const metaFontSize = 10;
    const lineHeight = 6;
    
    let yPosition = 30;
    const margin = 25;
    const maxWidth = doc.internal.pageSize.width - (margin * 2);
    
    // Función para agregar texto con wrap mejorada
    function addWrappedText(text: string, fontSize: number, y: number, maxWidth: number, isBold: boolean = false, color: [number, number, number] = [0, 0, 0]): number {
        doc.setFontSize(fontSize);
        doc.setTextColor(color[0], color[1], color[2]);
        if (isBold) {
            doc.setFont('helvetica', 'bold');
        } else {
            doc.setFont('helvetica', 'normal');
        }
        
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, margin, y);
        return y + (lines.length * lineHeight);
    }
    
    // Función para agregar línea separadora
    function addSeparatorLine(y: number): number {
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(margin, y, doc.internal.pageSize.width - margin, y);
        return y + 10;
    }
    
    // Función para agregar items con bullets mejorada
    function addItemsWithBullets(items: ExportItem[], sectionTitle: string, startY: number): number {
        if (!items || items.length === 0) return startY;
        
        let currentY = startY;
        
        // Verificar si necesitamos nueva página
        if (currentY > doc.internal.pageSize.height - 50) {
            doc.addPage();
            currentY = 30;
        }
        
        // Agregar título de sección con estilo
        currentY = addWrappedText(sectionTitle, sectionFontSize, currentY, maxWidth, true, [0, 102, 204]) + 8;
        
        // Agregar items con mejor formato
        items.forEach((item, index) => {
            if (currentY > doc.internal.pageSize.height - 40) {
                doc.addPage();
                currentY = 30;
            }
            
            doc.setFontSize(itemFontSize);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');
            
            // Bullet point más elegante
            const bulletPoint = item.prominent ? '* ' : (item.daily ? '~ ' : '• ');
            const itemText = `${bulletPoint}${item.description}`;
            
            const lines = doc.splitTextToSize(itemText, maxWidth - 15);
            doc.text(lines, margin + 10, currentY);
            currentY += lines.length * lineHeight + 3;
            
            // Agregar indicadores especiales si aplica
            if (item.prominent || item.daily) {
                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                let indicators = [];
                if (item.prominent) indicators.push('Destacado');
                if (item.daily) indicators.push('Diario');
                
                if (indicators.length > 0) {
                    doc.text(`(${indicators.join(', ')})`, margin + 15, currentY);
                    currentY += 4;
                }
            }
        });
        
        return currentY + 12;
    }
    
    // Función para agregar header/footer
    function addPageHeader() {
        const pageWidth = doc.internal.pageSize.width;
        
        // Solo agregar header en páginas que no sean la primera
        const currentPageNum = (doc as any).internal.getCurrentPageInfo().pageNumber;
        if (currentPageNum === 1) return;
        
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.setFont('helvetica', 'normal');
        
        // Fecha de generación
        const currentDate = new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        doc.text(`Generado el ${currentDate}`, margin, 15);
        
        // Número de página
        doc.text(`Página ${currentPageNum}`, pageWidth - margin - 20, 15);
    }
    
    // Header principal del documento
    doc.setFillColor(0, 102, 204);
    doc.rect(0, 0, doc.internal.pageSize.width, 25, 'F');
    
    // Título dentro del header azul - ajustar posición vertical
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(titleFontSize);
    doc.setFont('helvetica', 'bold');
    const lines = doc.splitTextToSize(`REPORTE DE ACCIONES`, maxWidth);
    // Centrar verticalmente en el header (25px de alto, título aprox en posición 18)
    doc.text(lines, margin, 18);
    
    // Mover posición después del header azul
    yPosition = 45;
    
    // Restablecer color de texto para el contenido
    doc.setTextColor(0, 0, 0);
    
    // Información general del reporte
    yPosition = addWrappedText(`Resumen completo de todas las categorías de pilares`, metaFontSize, yPosition, maxWidth, false, [100, 100, 100]) + 5;
    yPosition = addSeparatorLine(yPosition);
    
    // Procesar cada categoría
    categories.forEach((categoryData, index) => {
        const { categoryName, categoryInfo, pillarType: catPillarType, categoryData: catData } = categoryData;
        
        // Nueva página para cada categoría (excepto la primera)
        if (index > 0) {
            doc.addPage();
            yPosition = 30;
        }
        
        // Agregar header a cada página
        addPageHeader();
        
        // Box para el título de categoría
        doc.setFillColor(245, 245, 245);
        doc.rect(margin - 5, yPosition - 5, maxWidth + 10, 25, 'F');
        
        // Título de la categoría con pilar
        const pillarEmoji = {
            'health': '[SALUD]',
            'relational': '[RELACIONAL]', 
            'vocational': '[VOCACIONAL]',
            'spiritual': '[ESPIRITUAL]'
        }[catPillarType] || '[CATEGORIA]';
        
        yPosition = addWrappedText(`${pillarEmoji} ${categoryName.toUpperCase()}`, categoryTitleFontSize, yPosition + 5, maxWidth, true, [0, 102, 204]) + 15;
        
        // Verificar si la categoría tiene contenido
        const hasContent = hasCategoryContent(categoryInfo);
        const isActive = catData?.active ?? false;
        
        // DEBUG: Log para ver el contenido de la categoría
        console.log(`📄 PDF Export - ${categoryName}: elements=${categoryInfo.elements?.length || 0}, objectives=${categoryInfo.objectives?.length || 0}, hasContent=${hasContent}, isActive=${isActive}`);
        
        console.log(`🔍 PDF Export - ${categoryName} hasContent: ${hasContent}, isActive: ${isActive}`);
        
        // Información de estado y metadatos
        if (catData) {
            let metaInfo = [];
            
            if (catData.priority !== undefined) {
                metaInfo.push(`Importancia: ${getPriorityText(catData.priority)}`);
            }
            
            if (catData.state !== undefined) {
                metaInfo.push(`Estado: ${getStateText(catData.state)}`);
            }
            
            metaInfo.push(`Estado: ${isActive ? 'Activa' : 'Inactiva'}`);
            
            if (metaInfo.length > 0) {
                yPosition = addWrappedText(metaInfo.join(' | '), metaFontSize, yPosition, maxWidth, false, [100, 100, 100]) + 8;
            }
        }
        
        yPosition = addSeparatorLine(yPosition);
        
        // Manejar categorías vacías
        if (!hasContent) {
            doc.setFillColor(255, 248, 220);
            doc.rect(margin - 5, yPosition - 5, maxWidth + 10, 30, 'F');
            
            yPosition = addWrappedText('[!] CATEGORIA SIN CONTENIDO', sectionFontSize, yPosition + 5, maxWidth, true, [255, 165, 0]) + 8;
            yPosition = addWrappedText('Esta categoría no contiene información. Agrega elementos para activarla y comenzar a desarrollar este pilar.', itemFontSize, yPosition, maxWidth, false, [150, 150, 150]) + 15;
        } else {
            // Mostrar todas las secciones con contenido
            const sections = [
                { title: '[*] Elementos', items: categoryInfo.elements },
                { title: '[>] Objetivos', items: categoryInfo.objectives },
                { title: '[+] Acciones Pasadas - Positivas', items: categoryInfo.positive_actions },
                { title: '[^] Acciones Pasadas - Por Mejorar', items: categoryInfo.improve_actions },
                { title: '[~] Habitos', items: categoryInfo.habits },
                { title: '[!] Acciones Futuras - Corto Plazo', items: categoryInfo.short_actions },
                { title: '[=] Acciones Futuras - Mediano Plazo', items: categoryInfo.middle_actions },
                { title: '[*] Acciones Futuras - Largo Plazo', items: categoryInfo.long_actions }
            ];
            
            sections.forEach(section => {
                if (section.items && section.items.length > 0) {
                    yPosition = addItemsWithBullets(section.items, section.title, yPosition);
                }
            });
            
            // Si no hay secciones con contenido después de todo
            const hasSections = sections.some(section => section.items && section.items.length > 0);
            if (!hasSections) {
                yPosition = addWrappedText('[!] Sin secciones con contenido visible', itemFontSize, yPosition, maxWidth, false, [200, 100, 100]) + 10;
            }
        }
    });
    
    // Footer final
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const finalY = Math.max(yPosition + 20, doc.internal.pageSize.height - 20);
    
    // Información de generación
    doc.text('Documento generado por Alineados - Sistema de Gestión Personal', margin, finalY);
    
    // Número de página en el footer
    const currentPageNum = (doc as any).internal.getCurrentPageInfo().pageNumber;
    const pageWidth = doc.internal.pageSize.width;
    doc.text(`Página ${currentPageNum}`, pageWidth - margin - 20, finalY);
    
    // Guardar el PDF con nombre más descriptivo
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `Alineados_Acciones_${timestamp}.pdf`;
    doc.save(fileName);
} 