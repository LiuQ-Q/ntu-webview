<template>
  <div 
    style="width:50%;" 
    class="mt-3"
  >
    <b-form>
      <b-form-group label="机构名称:">
        <b-form-input 
          value="test1"
          disabled 
        ></b-form-input>
      </b-form-group>

      <b-form-group label="简介:">
        <b-form-textarea
          rows="3"
          max-rows="6"
          value="Default organization for test1"
        ></b-form-textarea>
      </b-form-group>
    </b-form>
  </div>
</template>