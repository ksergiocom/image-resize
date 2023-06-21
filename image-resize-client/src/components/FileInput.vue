<template>
	<div class="container">
		<div class="mb">
			<h1>Resize and format images</h1>
			<p>Select your desired width and/or height. The file output file extension and the cropping style. Then just select
				or drag a image from your device.</p>
			<p>This is a personal project from <a href="https://www.ksergio.com">www.ksergio.com</a></p>
		</div>
		<div>
			<label>Size</label>
			<div class="size">
				<input type="number" v-model="options.width" placeholder="Optional">x<input type="number" v-model="options.height"
					placeholder="Optional">
			</div>
		</div>
		<div>
			<label>Format</label>
			<select v-model="options.format">
				<option value="jpeg">jpeg</option>
				<option value="png">png</option>
				<option value="webp">webp</option>
			</select>
		</div>
		<div>
			<label>Position</label>
			<select v-model="options.position">
				<option value="cover">Cover</option>
				<option value="contain">Contain</option>
				<option value="fill">Fill</option>
				<option value="inside">Inside</option>
				<option value="outside">Outside</option>
			</select>
		</div>
		<div v-if="loading" class="loading">
			<Spinner />
		</div>
		<label v-if="!loading" for="fileInput" class="false-file-input">
			<input name="fileInput" id="fileInput" ref="fileInput" class="file-input" type="file" @change="onChange($event)"
				accept="image/*">
		</label>
	</div>
</template>

<script setup>
import Spinner from './Spinner.vue'

import { ref } from 'vue'

const fileInput = ref()
const loading = ref(false)

const options = ref({
	width: null,
	height: null,
	format: 'jpeg',
	position: 'contain'
})


const onChange = async (e) => {
	const file = e.target.files[0]
	if (!file) return

	loading.value = true

	const data = new FormData()
	data.append('file', file)
	data.append('width', options.value.width)
	data.append('height', options.value.height)
	data.append('format', options.value.format)
	data.append('position', options.value.position)

	console.log(data)


	try {
		const res = await fetch('/upload', {
			method: "POST",
			body: data
		})

		if(!res.ok){
			file.value = null
			loading.value = false
			const json = await res.json()
			if(json.error == "NOT_IMAGE"){
				return alert('The file is not a image')
			}
			if (json.error == "SIZE_TO_BIG") {
				return alert('The size of the file is too big')
			}else{
				return alert('Something went wrong!')
			}
		}

		const blob = await res.blob()
		const name = file.name.split('.')[0] + '.' + options.value.format
		var a = document.createElement("a");
		document.body.appendChild(a);
		a.style = "display: none";
		let url = window.URL.createObjectURL(blob);
		a.href = url;
		a.download = name;
		a.click();
		window.URL.revokeObjectURL(url);
		
	} catch (error) {
		alert(error)
	}

	file.value = null
	loading.value = false

}

const onDrop = (e) => {
	console.log(e)
}


</script>

<style scoped>
a {
	color: gold;
}

a:hover {
	color: goldenrod;
}

.mb {
	margin-bottom: 1rem;
}

hr {
	margin: 1rem 0;
	border: none;
	border-top: 1px solid rgba(255, 255, 255, 0.274);
}

div {
	display: flex;
	flex-direction: column;
	gap: 0.3rem;
	justify-content: space-between;
}

.container {
	padding: 2rem;
	max-width: 480px;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.size {
	display: flex;
	flex-direction: row;
	gap: 1rem;
	align-items: center;
}

.file-input {
	cursor: pointer;
}

.false-file-input {
	border: dashed white 1px;
	padding: 1.5rem;
	text-align: center;
	margin-top: 2rem;
}

.false-file-input:hover {
	cursor: pointer;
	background-color: #292929;
}

input,
select {
	padding: 0.3rem;
}

.loading {
	margin: 2rem auto;
}</style>