export async function fetchCategories() {
    const response = await fetch('/api/categories?visible=1');
    const data = await response.json();
    
    return data.success ? data.data : [];
}