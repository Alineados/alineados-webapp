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
    
    // Título principal del documento
    yPosition = addWrappedText(`ACCIONES`, titleFontSize, yPosition, maxWidth) + 15;
    
    // Procesar cada categoría
    categories.forEach((categoryData, index) => {
        const { categoryName, categoryInfo, categoryData: catData } = categoryData;
        
        // Cada categoría comienza en una nueva página (excepto la primera)
        if (index > 0) {
            doc.addPage();
            yPosition = 20;
        }
        
        // Título de la categoría
        yPosition = addWrappedText(categoryName.toUpperCase(), sectionFontSize, yPosition, maxWidth) + 10;
        
        // Verificar si la categoría está vacía
        const hasContent = hasCategoryContent(categoryInfo);
        const isActive = catData?.active ?? false;
        
        // Información de estado de la categoría
        if (!hasContent) {
            // Categoría vacía
            yPosition = addWrappedText('(!) CATEGORÍA INACTIVA - SIN DATOS', itemFontSize, yPosition, maxWidth) + 5;
            yPosition = addWrappedText('Esta categoría no contiene información. Agrega elementos para activarla.', itemFontSize, yPosition, maxWidth) + 10;
        } else {
            // Información de importancia y estado
            if (catData) {
                if (catData.priority !== undefined) {
                    const priorityText = `Importancia: ${getPriorityText(catData.priority)}`;
                    yPosition = addWrappedText(priorityText, itemFontSize, yPosition, maxWidth) + 3;
                }
                
                if (catData.state !== undefined) {
                    const stateText = `Estado: ${getStateText(catData.state)}`;
                    yPosition = addWrappedText(stateText, itemFontSize, yPosition, maxWidth) + 5;
                }
            }
            
            // Información adicional si la categoría está inactiva
            if (!isActive) {
                yPosition = addWrappedText('(!) CATEGORÍA INACTIVA', itemFontSize, yPosition, maxWidth) + 5;
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
    });
    
    // Guardar el PDF
    const fileName = `Acciones.pdf`;
    doc.save(fileName);
} 