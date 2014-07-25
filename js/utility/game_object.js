/**
* @class GameObject
* @brief Creates a game object with a width, height and an optional texture
* @author Daniël Konings
*/
var GameObject = function(w,h,texture)
{
	this.__quad = Quad.new();
	if(texture !== undefined)
	{
		this.__quad.setTexture(texture);
	}

	this.__quad.setRotation(-Math.PI/2,0,0);
	this.__quad.setScale(w,0,h);

	extend(this,this.__quad);

	/// Sets the Z index of this object
	this.setZ = function(z)
	{
		var translation = this.translation();
		this.setTranslation(translation.x,translation.y,z);
	}

	/// Sets the x and y position of this object
	this.setPosition = function(x,y)
	{
		var translation = this.translation();
		this.setTranslation(x,y,translation.z);
	}

	this.setRotation = function(x,y,z)
	{
		this.__quad.setRotation(-Math.PI/2+x,y,z);
	}

	this.delete = function()
	{
		this.__quad.destroy();
		this.__quad = null;
	}
}