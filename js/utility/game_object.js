/**
* @class GameObject
* @brief Creates a game object with a width, height and an optional texture
* @author Daniël Konings
*/
var GameObject = function(w,h,texture)
{
	this.__quad = Quad.new();
	this._z = 0;
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
		this._z = z;
	}

	/// Returns the Z index of this object
	this.z = function()
	{
		return this._z;
	}

	/// Sets the x and y position of this object
	this.setPosition = function(x,y)
	{
		var translation = this.translation();
		this.setTranslation(-_GLOBAL_["RenderWidth"]/2+x,_GLOBAL_["RenderHeight"]/2-y,translation.z);
	}

	this._setRotation = this.setRotation;

	this.setRotation = function(x,y,z)
	{
		this._setRotation(-Math.PI/2+x,y,z);
	}

	this._setBlend = this.setBlend;

	this.setBlend = function(r,g,b)
	{
		this._setBlend(r,g,b);
	}
}