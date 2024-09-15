/* functions */
export function getUUID(prefix) {
	return `${prefix}-${crypto.randomUUID().split('-').slice(0, -1).join('-')}`;
}

export function slugify(string) {
	return string.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, ' ').trim().replace(/[\s-]+/g, '-')
}

export const pbUrl = import.meta.env.VITE_PB_URL

export function filterHelper(data, filter) {
	if (!data) return []

	return data.filter(item => {
		let res = true
		if (filter.search) res = item.name?.toLowerCase().includes(filter.search.toLowerCase()) || item.description?.toLowerCase().includes(filter.search.toLowerCase()) || item.text?.toLowerCase().includes(filter.search.toLowerCase())
		if (res && filter.template) res = item.template.includes(filter.template)
		if (res && filter.type) res = item.type.includes(filter.type)
		if (res && filter.block) res = item.block.includes(filter.block)
		if (res && filter.visibility) res = item.visibility == filter.visibility
		return res
	})
}

export async function getCollection(pb, collection, callback) {
	const list = await pb.collection(collection).getFullList({
		sort: '-created'
	})

	if (callback) callback(list)
	return list
}

export function mapErrors(form, error) {
	if (error.data?.data) {
		for (const [key, value] of Object.entries(error.data.data)) {
			if (form.value.data.hasOwnProperty(key) && value.message) form.value.errors[key] = value.message
		}
	}
}

export function getImageURL(collection, id, image, thumb) {
	if (!collection || !id || !image) return ''
	return `${pbUrl}/api/files/${collection}/${id}/${image}${thumb ? `?thumb=${thumb}` : ''}`
}

/* data */
export const themeOptions = [
	{
		title: 'Verona',
		value: 's1'
	}, {
		title: 'Paris',
		value: 'paris'
	}, {
		title: 'Barcelona',
		value: 'barcelona'
	}
]

export const typeOptions = [
	{
		title: 'Block',
		value: 'block'
	}, {
		title: 'Page',
		value: 'page'
	}, {
		title: 'Category',
		value: 'category'
	}, {
		title: 'Other',
		value: 'other'
	}
]

export const blockOptions = [
	{
		title: 'Directory',
		value: 'directory'
	}, {
		title: 'Menu',
		value: 'menu'
	}, {
		title: 'Highlights',
		value: 'highlights'
	}, {
		title: 'Gallery',
		value: 'gallery'
	}, {
		title: 'Social networks',
		value: 'socialnetworks'
	}, {
		title: 'Testimonials',
		value: 'testimonials'
	}, {
		title: 'Text',
		value: 'text'
	}, {
		title: 'CTA',
		value: 'cta'
	}, {
		title: 'Dynamic banner',
		value: 'banner'
	}, {
		title: 'Instagram',
		value: 'instagram'
	}, {
		title: 'Form',
		value: 'form'
	}
]

export const visibilityOptions = [
	{
		title: 'Public',
		value: 'public'
	}, {
		title: 'Private',
		value: 'private'
	}
]

export const themesMap = themeOptions.reduce((acc, item) => {
	acc[item.value] = item.title
	return acc
}, {})

export const typesMap = typeOptions.reduce((acc, item) => {
	acc[item.value] = item.title
	return acc
}, {})

export const blocksMap = blockOptions.reduce((acc, item) => {
	acc[item.value] = item.title
	return acc
}, {})

export const visibilityMap = visibilityOptions.reduce((acc, item) => {
	acc[item.value] = item.title
	return acc
}, {})