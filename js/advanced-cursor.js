/**
 * Implementação de cursor personalizado - DESATIVADO
 * Voltando para o cursor padrão do navegador
 */

document.addEventListener('DOMContentLoaded', () => {
    // Restaurar cursor padrão do navegador
    resetToBrowserCursor();
});

function resetToBrowserCursor() {
    // Remover elementos do cursor personalizado
    const cursorElements = document.querySelector('.cursor-container');
    if (cursorElements) {
        cursorElements.style.display = 'none';
    }
    
    // Restaurar o cursor padrão para o body e elementos interativos
    document.body.style.cursor = 'auto';
    
    const interactiveElements = document.querySelectorAll('a, button, .interactive');
    interactiveElements.forEach(el => {
        el.style.cursor = 'pointer';
    });
}

// Desabilitar qualquer função que manipule o cursor personalizado
function initAdvancedCursor() {
    // Função desativada
    return;
}
