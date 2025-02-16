const categoryService = require("../services/CategoryService");

const createCategory = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.handler.badRequest("Category name is required")
        }
        const category = await categoryService.createCategory(req.body);
        return res.handler.success(category, "Category created successfully");
    } catch (error) {
        return res.handler.serverError();
    }
};

const getCategoriesTree = async (req, res) => {
    try {
        const categories = await categoryService.getCategoriesTree();
        return res.handler.success(categories, "Category fetched successfully");
    } catch (error) {
        return res.handler.serverError();
    }
};

const updateCategory = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.handler.badRequest("Category ID is required.");
        }

        const { name, isActive, parent } = req.body;

        if (!name || isActive === undefined || parent === undefined) {
            return res.handler.badRequest("Missing required fields: name, isActive, or parent.");
        }

        const category = await categoryService.updateCategory(req.params.id, req.body);

        if (!category) return res.handler.notFound("Category not found");

        return res.handler.success(category, "Category updated successfully");
    } catch (error) {
        return res.handler.serverError();
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await categoryService.deleteCategory(req.params.id);
        if (!category) return res.handler.notFound("Category not found");

        return res.handler.success("Category deleted and subcategories reassigned");
    } catch (error) {
        return res.handler.serverError();
    }
};

module.exports = {
    createCategory,
    getCategoriesTree,
    updateCategory,
    deleteCategory
};
