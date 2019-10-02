		//<script id="vertexShader" type="x-shader/x-vertex">
	const vertex_shader = '\
      varying vec3 worldPosition;\n\
			vec3 transformDirection(in vec3 dir, in mat4 matrix) {\n\
				return normalize((matrix * vec4( dir, 0.0)).xyz);\n\
			}\n\
      void main () {\n\
        vec4 p = vec4 (position, 1.0);\n\
        worldPosition = transformDirection(position, modelMatrix);\n\
        gl_Position = projectionMatrix * modelViewMatrix * p;\n\
      }';
		//</script>
		//<script id="fragmentShader-baseball-equi" type="x-shader/x-fragment">
  const fragmentShader_baseball_equi = '\
      uniform sampler2D map;\n\
			varying vec3 worldPosition;\n\
      const float pi = 3.141592653589793238462643;\n\
			const float twoPi = 6.283185307179586476925286;\n\
			mat3 rotationMatrix(vec3 euler) {\n\
				vec3 se = sin(euler);\n\
				vec3 ce = cos(euler);\n\
				return mat3(ce.y, 0, -se.y, 0, 1, 0, se.y, 0, ce.y) * mat3(1, 0, 0, 0, ce.x, se.x, 0, -se.x, ce.x) * mat3(ce.z,  se.z, 0,-se.z, ce.z, 0, 0, 0, 1);\n\
			}\n\
			vec3 toCartesian(vec2 st){\n\
				vec3 ps = rotationMatrix(vec3(st.y, st.x, 0.0)) * vec3(0.0, 0.0, -1.0);\n\
				return rotationMatrix(radians(vec3(-0.0, -180.0, -90.0))) * ps;\n\
			}\n\
			void main () {\n\
				vec3 direction = normalize(worldPosition);\n\
				vec2 st = vec2(atan(direction.z, direction.x), acos(-direction.y));\n\
				st /= vec2(twoPi, pi);\n\
        st.x += 0.5;\n\
				vec2 txtCoord;\n\
				if(st.x >= 0.125 && st.x <= 0.875 && st.y >= 0.25 && st.y <= 0.75){\n\
					txtCoord.x = (st.x - 0.125) / 0.75;\n\
					txtCoord.y = st.y + 0.25;\n\
				} else {\n\
					txtCoord = vec2(st.x - 0.5, st.y + 0.5) * vec2(twoPi, pi);\n\
					vec3 uv = toCartesian(txtCoord);\n\
					txtCoord = vec2(atan(uv.x, uv.z), acos(-uv.y));\n\
					txtCoord /= vec2(twoPi, pi);\n\
					txtCoord.x = (0.375 - txtCoord.x) / 0.75;\n\
					txtCoord.y = txtCoord.y - 0.25;\n\
				}\n\
				gl_FragColor = texture2D(map, txtCoord);\n\
      }';
		//</script>


		//<script id="fragmentShader-baseball-equi-v2" type="x-shader/x-fragment">
		const fragmentShader_baseball_equi_v2 = '\
      uniform sampler2D map;\n\
			varying vec3 worldPosition;\n\
      const float pi = 3.141592653589793238462643;\n\
			const float twoPi = 6.283185307179586476925286;\n\
			mat3 rotationMatrix(vec3 euler) {\n\
				vec3 se = sin(euler);\n\
				vec3 ce = cos(euler);\n\
				return mat3(ce.y, 0, -se.y, 0, 1, 0, se.y, 0, ce.y) * mat3(1, 0, 0, 0, ce.x, se.x, 0, -se.x, ce.x) * mat3(ce.z,  se.z, 0,-se.z, ce.z, 0, 0, 0, 1);\n\
			}\n\
			vec3 toCartesian(vec2 st){\n\
				vec3 ps = rotationMatrix(vec3(st.y, st.x, 0.0)) * vec3(0.0, 0.0, -1.0);\n\
				return rotationMatrix(radians(vec3(-0.0, -180.0, -90.0))) * ps;\n\
			}\n\
			void main () {\n\
				vec3 direction = normalize(worldPosition);\n\
				vec2 st = vec2(atan(direction.z, direction.x), acos(-direction.y));\n\
				st /= vec2(twoPi, pi);\n\
        st.x += 0.5;\n\
				vec2 txtCoord;\n\
				if(st.x >= 0.125 && st.x <= 0.875 && st.y >= 0.25 && st.y <= 0.75){\n\
					txtCoord.x = (st.x - 0.125) / 0.75;\n\
					txtCoord.y = st.y * (2.0 / 3.0) * 2.0;\n\
				} else {\n\
					txtCoord = vec2(st.x - 0.5, st.y + 0.5) * vec2(twoPi, pi);\n\
					vec3 uv = toCartesian(txtCoord);\n\
					txtCoord = vec2(atan(uv.x, uv.z), acos(-uv.y));\n\
					txtCoord /= vec2(twoPi, pi);\n\
					txtCoord.x = (0.375 - txtCoord.x) / 0.75;\n\
					txtCoord.y = (txtCoord.y - 0.25) * (2.0 / 3.0);\n\
				}\n\
				gl_FragColor = texture2D(map, txtCoord);\n\
      }';
		//</script>

		//<script id="fragmentShader-equi" type="x-shader/x-fragment">
    const fragmentShader_equi = '\
      uniform sampler2D map;\n\
      varying vec3 worldPosition;\n\
      const float pi = 3.141592653589793238462643;\n\
      const float twoPi = 6.283185307179586476925286;\n\
      void main () {\n\
        vec3 direction = normalize(worldPosition);\n\
        vec2 st = vec2(atan(direction.z, direction.x), acos(-direction.y));\n\
        st /= vec2(twoPi, pi);\n\
        st.x += 0.5;\n\
        gl_FragColor = texture2D(map, st);\n\
      }';
		//</script>
